import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ESIndex, ES_MAX_SEARCH_COUNT } from 'common/constants/es'
import { ESService } from 'common/modules/es/es.service'
import { IGlobalConfig } from 'common/interfaces'
import { RESOURCE_ACTION, RESOURCE_TYPE } from 'common/constants/rbac'

import { RBACCheckTenantResourceAction } from 'common/helpers/rbac'
import { sortResource } from 'common/helpers/array'
import { generateDeploymentName } from 'common/helpers/deployment'
import { parseClusterIdWithFte } from 'common/helpers/cluster'
import { AuthService } from 'common/modules/auth/auth.service'
import { IAuthUser } from 'common/decorators/parameters/AuthUser'
import { ISettings } from './entities/global.entity'
import { Logger } from 'common/helpers/logger'

@Injectable()
export class GlobalService {
  private readonly logger = new Logger(GlobalService.name)
  private globalData

  constructor(private configService: ConfigService, private eSService: ESService, private authService: AuthService) {
    this.globalData = this.configService.get<IGlobalConfig>('global') || {}
  }

  getMetaData() {
    return {
      roles: this.globalData.roles,
      statuses: this.globalData.statuses
    }
  }

  getCids() {
    const cids = this.globalData.cids || []
    return {
      items: cids,
      count: cids.length
    }
  }

  getEnvs() {
    const envs = this.globalData.envs || []
    return {
      items: envs,
      count: envs.length
    }
  }

  getGroups() {
    const groups = this.globalData.groups || []
    return {
      items: groups,
      count: groups.length
    }
  }

  getTemplateTypes() {
    const types = this.globalData.templateTypes || []
    return {
      items: types,
      count: types.length
    }
  }

  getProfDescriptorObject() {
    const types = this.globalData.profDescriptorObject || []
    return {
      items: types,
      count: types.length
    }
  }

  getSettings(): ISettings {
    const settings = this.globalData.settings
    if (!settings) return
    /**
     settings is a JSON string, for example:
     '{
      "proxy": {
          "host": "10.163.55.205",
          "port": 3128
      },
      "mysql": {
          "host": "mysql.ske-database",
          "port": "3306",
          "password": "root123",
          "dbname": "shopee_app_infra_k8s_platform_db",
          "username": "root",
          "collation": "utf8mb4_unicode_ci",
          "parse_time": true
      },
      "mailer": {
          "server": "smtp.shopeemobile.com",
          "port": "587"
      }
     }'
    */
    const settingsObj = JSON.parse(settings)
    return settingsObj
  }

  async getResources(authUser: IAuthUser, searchBy: string, authToken: string) {
    const visibleTenants = await this.authService.listVisibleTenants(authUser, authToken)
    const tenantPermissions = await this.authService.getTenantPermissions(authUser.roles, authToken)
    const applicationTenants = visibleTenants
      .filter(({ id }) =>
        RBACCheckTenantResourceAction(tenantPermissions, id, RESOURCE_TYPE.APPLICATION, RESOURCE_ACTION.View)
      )
      .map(({ id }) => id)

    let searchedApplications = []
    let searchedPods = []
    const tenantCache = {}

    try {
      const { documents = [] } = await this.eSService.booleanQueryAll(
        ESIndex.APPLICATION,
        {
          must: [
            {
              terms: {
                tenant: applicationTenants
              }
            },
            {
              regexp: { app: `.*${searchBy}.*` }
            }
          ]
        },
        ES_MAX_SEARCH_COUNT
      )
      searchedApplications = await Promise.all(
        documents.map(async ({ app, tenant: tenantId, project }) => {
          let tenant = tenantCache[tenantId]
          if (!tenant) {
            tenant = await this.authService.getTenantById(tenantId, authToken)
            tenantCache[tenantId] = tenant
          }
          const { id, name } = tenant
          return {
            appName: app,
            tenantName: name,
            tenantId: id,
            projectName: project,
            kind: 'application'
          }
        })
      )
    } catch (err) {
      this.logger.error(`Fail to get ES applications for: ${err}`)
      throw err
    }

    try {
      const { documents = [] } = await this.eSService.booleanQueryAll(
        ESIndex.POD,
        {
          must: [
            {
              terms: {
                tenant: applicationTenants
              }
            }
          ],
          should: [
            {
              regexp: { pod: `.*${searchBy}.*` }
            },
            {
              regexp: { podIP: `.*${searchBy}.*` }
            }
          ],
          minimumShouldMatch: 1
        },
        ES_MAX_SEARCH_COUNT
      )
      searchedPods = await Promise.all(
        documents.map(async ({ tenant: tenantId, project, app, pod, podIP, clusterId }) => {
          let tenant = tenantCache[tenantId]
          if (!tenant) {
            tenant = await this.authService.getTenantById(tenantId, authToken)
            tenantCache[tenantId] = tenant
          }
          const { env, cid } = parseClusterIdWithFte(clusterId)
          const { id, name } = tenant
          return {
            appName: app,
            tenantName: name,
            tenantId: id,
            projectName: project,
            deployName: generateDeploymentName(app, env, cid),
            podName: pod,
            podIP,
            clusterId,
            kind: 'pod'
          }
        })
      )
    } catch (err) {
      this.logger.error(`Fail to get ES pods for: ${err}`)
      throw err
    }

    return {
      pods: sortResource(searchedPods, 'pod'),
      applications: sortResource(searchedApplications, 'app')
    }
  }
}
