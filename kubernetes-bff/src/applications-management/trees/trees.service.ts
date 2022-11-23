import { Injectable } from '@nestjs/common'

import { ESService } from 'common/modules/es/es.service'
import { ProjectsService } from 'applications-management/projects/projects.service'
import { AuthService } from 'common/modules/auth/auth.service'

import { ESIndex, ES_MAX_SEARCH_COUNT } from 'common/constants/es'

import { ITenantTree, IApplicationTree } from './dto/trees.dto'
import { sortResource } from 'common/helpers/array'
import { IAuthUser } from 'common/decorators/parameters/AuthUser'

@Injectable()
export class TreesService {
  constructor(
    private readonly esService: ESService,
    private readonly projectsService: ProjectsService,
    private readonly authService: AuthService
  ) {}

  async getTenantProjectTree(authUser: IAuthUser, authToken: string): Promise<ITenantTree> {
    const visibleTenants = await this.authService.listVisibleTenants(authUser, authToken)

    const orderedTenantList = sortResource(visibleTenants)

    // get projects
    const tenantProjects = await Promise.all(
      orderedTenantList.map(async ({ id: tenantId, name: tenantName }) => {
        const { documents: projects } = await this.projectsService.getProjectsByTenant(tenantId)
        const formattedProjects = projects.map(({ project, clusters }) => ({
          tenantId,
          name: project,
          clusters
        }))
        return {
          id: tenantId,
          name: tenantName,
          projects: sortResource(formattedProjects)
        }
      })
    )
    return { tenants: tenantProjects }
  }

  async getApplicationTree({ tenantId, projectName }, authToken: string): Promise<IApplicationTree> {
    const tenantInfo = await this.authService.getTenantById(tenantId, authToken)
    const { name: tenantName } = tenantInfo
    // validate projectName and groupName
    await this.projectsService.getEsProject(projectName, tenantId)

    const applicationQueryParam = {
      must: [
        {
          term: { project: projectName }
        }
      ]
    }

    const { documents: applications } = await this.esService.booleanQueryAll(
      ESIndex.APPLICATION,
      applicationQueryParam,
      ES_MAX_SEARCH_COUNT
    )

    const formattedApplications = applications.map(({ group, project, app }) => ({
      tenantName: group,
      projectName: project,
      name: app,
      clusterId: 'dummy'
    }))

    return {
      applications: sortResource(formattedApplications),
      tenantName,
      name: projectName
    }
  }
}
