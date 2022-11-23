import { Injectable, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as moment from 'moment'
import { pick } from 'lodash'
import { HTTP_AGENT } from 'common/constants/http'
import { RESPONSE_CODE } from 'common/helpers/response'
import {
  IListNamespaceOamPayLoad,
  IListNamespaceOamResponse,
  IOam,
  IOpenApiConfig,
  IOpenApiBaseResponse
} from 'common/interfaces/openApiService.interface'
import axios from 'axios'
import { stringify } from 'querystring'
import { GetOrUpdateDeployParamsDto } from 'applications-management/deployments/dto/common/params.dto'
import { GetOrUpdateDeployQueryDto } from 'applications-management/deployments/dto/common/query.dto'
import { UpdateDeployLimitBody } from 'applications-management/deployments/dto/update-deployLimit.dto'
import { AUTH_SERVICE_COOKIE_KEY } from 'common/constants/sessions'
import {
  ApiDeployPathParams,
  CancelCanaryDeployBody,
  FullReleaseBody,
  RollbackDeploymentRequestBodyDto,
  RollbackDeploymentRequestParamsDto,
  RolloutRestartDeploymentRequestBodyDto,
  RolloutRestartDeploymentRequestParamsDto,
  ScaleDeployBody
} from 'applications-management/deployments/dto/deployment.dto'
import { ApplicationParamsDto } from 'applications-management/applications/dto/common/params.dto'
import { ApplicationDeploysQueryDto } from 'applications-management/applications/dto/get-applicationDeploys.dto'
import { IGlobalConfig } from 'common/interfaces'
import { GetOrUpdateNameParamsDto } from 'platform-management/clusters/dto/common/params.dto'
import { ClusterUpdateQuotasBodyDto } from 'platform-management/clusters/dto/update-cluster-quotas.dto'
import { IGetClusterQuotasResponseFromOpenApi } from 'platform-management/clusters/dto/get-cluster-quotas.dto'
import {
  CreateReleaseFreezeBodyDto,
  ListFreezesQueryDto,
  ListReleaseFreezesResponseDto,
  ReleaseFreezeItemDto,
  UpdateReleaseFreezeBodyDto
} from 'release-freezes-management/dto/freezes.dto'
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from 'common/constants/pipeline'
import { AddClustersFlavorsRequest, UpdateClusterFlavorsRequest } from 'platform-management/clusters/dto/flavor.dto'
import {
  IGetDeployConfigRequest,
  IUpdateDeployConfigRequest,
  IGetDeployConfigResponse,
  IUpdateDeployConfigResponse
} from 'deploy-config/dto/deploy-config-openapi.dto'
import { IGetPodPreviousLogRequest, IGetPodPreviousLogResponse } from 'applications-management/pods/dto/pod.dto'
import {
  CONVERT_PROFILING_TYPE,
  CreatePprofCronjobRequest,
  CreatePprofRequest,
  GetPprofListQuery,
  GetProfParams,
  PprofCommonParams,
  PprofListResponse,
  PROFILING_STATUS,
  GetProfCronJobQuery
} from 'pprof/dto/pprof.dto'
import {
  DeleteDeploymentParam,
  DeleteDeploymentQuery
} from 'applications-management/deployments/dto/delete-deployment.dto'
import { Logger } from 'common/helpers/logger'

type OpenAPiRequestFn = <T>(args: any) => Promise<T>

@Injectable()
export class OpenApiService {
  request: OpenAPiRequestFn
  private readonly logger = new Logger(OpenApiService.name)
  constructor(private configService: ConfigService) {
    const openApiConfig = this.configService.get<IOpenApiConfig>('openApi')
    if (!openApiConfig) {
      this.logger.error('Can not get open api service config!')
      return
    }

    const { protocol, host, port } = openApiConfig
    const openApiServer = port ? `${protocol}://${host}:${port}` : `${protocol}://${host}`

    this.request = async (args) => {
      const { server = openApiServer, resource, version = 'v1', params, headers, token, payload, method = 'get' } = args
      const prefix = 'openapi'
      const route = `${server}/${prefix}/${version}/${resource}`
      // const route = `http://localhost:8081/openapi/v1/${resource}`
      const tokenHeaders = token ? { [AUTH_SERVICE_COOKIE_KEY]: `Bearer ${token}` } : {}

      try {
        const response = await axios(route, {
          paramsSerializer: (params) => {
            return stringify(params)
          },
          headers: { ...tokenHeaders, ...headers },
          params,
          httpAgent: HTTP_AGENT,
          data: payload,
          method,
          timeout: 30000
        })
        return response.data
      } catch (err) {
        const { response } = err
        if (!response) {
          throw new InternalServerErrorException(`[openApiService]${err}`)
        }
        const {
          status,
          data: { message }
        } = response
        throw new HttpException(message, status)
      }
    }
  }

  async getDeploys(params: ApplicationParamsDto, query: ApplicationDeploysQueryDto, token: string) {
    const { tenantId, projectName, appName } = params
    const opt = {
      resource: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/deployments`,
      method: 'GET',
      params: query,
      token
    }

    const result: any = await this.request(opt)
    const { deploys } = result

    const globalConfig = this.configService.get<IGlobalConfig>('global')
    const { deleteDeploymentConfig } = globalConfig
    const { allowDeleteClusters = [], prohibitDeleteProjects = [] } = deleteDeploymentConfig
    const deployList = deploys.map((deploy) => {
      const { clusterName, podCount } = deploy
      const deletable =
        allowDeleteClusters.includes(clusterName) && !prohibitDeleteProjects.includes(projectName) && podCount === 0

      return {
        ...deploy,
        deletable
      }
    })
    result.deploys = deployList

    return result
  }

  async listPprofs(request: PprofCommonParams, query: GetPprofListQuery, token: string) {
    const { offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT, filterBy = '', orderBy = '' } = query
    const { tenantId, projectName, appName, deployName } = request
    const opt = {
      resource: `tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}/pprof`,
      method: 'GET',
      params: {
        limit: limit,
        offset: offset,
        filterBy: filterBy.replace(';', '&'), // http不支持，分号后面的query会省略
        orderBy
      },
      token
    }
    const result: PprofListResponse = await this.request(opt)
    // convert document.object
    const pprofList = result.list.map((item) => {
      const converts = Object.entries(CONVERT_PROFILING_TYPE)
      const obj = converts.find((c) => c[1] === item.object)
      if (obj) {
        item.object = obj[0]
      }
      item.status = item.status || PROFILING_STATUS.Running
      return item
    })
    return {
      list: pprofList,
      total: result.total,
      offset: offset,
      limit: limit
    }
  }

  async getPprof(request: GetProfParams, token: string) {
    const { tenantId, projectName, appName, deployName, profileId } = request
    try {
      const opt = {
        resource: `tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}/pprof/detail/${profileId}`,
        method: 'GET',
        token
      }
      const result = await this.request(opt)
      return result || {}
    } catch (err) {
      throw new HttpException(`${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async createPprof(request: PprofCommonParams, body: CreatePprofRequest, token: string, operator: string) {
    const { tenantId, projectName, appName, deployName } = request
    try {
      const opt = {
        resource: `tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}/pprof`,
        method: 'POST',
        payload: {
          ...body,
          podIp: body.podIP,
          operator
        },
        token
      }
      const result = await this.request(opt)

      return result || {}
    } catch (err) {
      throw new HttpException(`${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async createPprofCronjob(
    request: PprofCommonParams,
    body: CreatePprofCronjobRequest,
    token: string,
    operator: string
  ): Promise<any> {
    const { tenantId, projectName, appName, deployName } = request
    try {
      const opt = {
        resource: `tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}/pprof/cronjob`,
        method: 'POST',
        payload: {
          ...body,
          operator
        },
        token
      }
      const result = await this.request(opt)

      return result || {}
    } catch (err) {
      throw new HttpException(`${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getPprofCronjob(request: PprofCommonParams, query: GetProfCronJobQuery, token: string) {
    const { tenantId, projectName, appName, deployName } = request
    const { cluster } = query
    try {
      const opt = {
        resource: `tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}/pprof/cronjob`,
        method: 'GET',
        params: {
          cluster
        },
        token
      }
      const result: any = await this.request(opt)
      if (!result || !result.enable) {
        return {}
      }
      return result
    } catch (err) {
      throw new HttpException(`${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async listReleaseFreezes(query: ListFreezesQueryDto, token: string): Promise<ListReleaseFreezesResponseDto> {
    const { offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT, status = '' } = query
    const opt = {
      resource: 'release_freezes',
      params: {
        limit: limit ? Number(limit) : DEFAULT_LIMIT,
        offset: offset ? Number(offset) : DEFAULT_OFFSET,
        status: status
      },
      token
    }
    const result: any = await this.request(opt)
    const releaseFreezeList = result.items.map((item) => {
      const { id, env, startTime, endTime, reason, status, createdBy, createdAt, updatedBy, updatedAt, resource } = item
      const releaseFreezeInfo = {
        id,
        env,
        startTime,
        endTime,
        reason,
        status,
        createdBy,
        createdAt,
        updatedBy,
        updatedAt,
        resource
      }
      return releaseFreezeInfo
    })
    return {
      releaseFreezeList,
      total: result.total,
      code: result.code,
      message: result.message
    }
  }

  async createReleaseFreeze(body: CreateReleaseFreezeBodyDto, token: string, user: string) {
    const { envs, startTime, endTime, reason } = body
    const env = envs.join('/')
    try {
      const opt = {
        resource: 'release_freezes',
        method: 'POST',
        payload: {
          env,
          startTime: moment(startTime).utcOffset(8).format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment(endTime).utcOffset(8).format('YYYY-MM-DD HH:mm:ss'),
          reason,
          createdBy: user
        },
        token
      }
      const result = await this.request(opt)

      return result || {}
    } catch (err) {
      throw new HttpException(`${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateReleaseFreeze(releaseFreezeId: string, body: UpdateReleaseFreezeBodyDto, token: string, user: string) {
    const { envs, startTime, endTime, reason } = body
    const env = envs.join('/')
    try {
      const opt = {
        resource: `release_freezes/${releaseFreezeId}`,
        method: 'PUT',
        payload: {
          env,
          startTime: moment(startTime).utcOffset(8).format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment(endTime).utcOffset(8).format('YYYY-MM-DD HH:mm:ss'),
          reason,
          updatedBy: user
        },
        token
      }
      const result = await this.request(opt)

      return result || {}
    } catch (err) {
      throw new HttpException(`failed to edit release freeze: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async stopReleaseFreeze(releaseFreezeId: string, token: string, user: string) {
    const opt = {
      resource: `release_freezes/${releaseFreezeId}:stop`,
      method: 'POST',
      payload: { updatedBy: user },
      token
    }
    const result = await this.request(opt)
    return result
  }

  async getReleaseFreeze(releaseFreezeId: string, token: string): Promise<ReleaseFreezeItemDto> {
    const opt = {
      resource: `release_freezes/${releaseFreezeId}`,
      method: 'GET',
      token
    }
    const result: ReleaseFreezeItemDto = await this.request(opt)
    return result
  }

  async editDeploymentResource(
    params: GetOrUpdateDeployParamsDto,
    query: GetOrUpdateDeployQueryDto,
    body: UpdateDeployLimitBody,
    token: string
  ) {
    const { tenantId, projectName, appName, deployName } = params
    const { clusterName } = query
    const { phases, appInstanceName } = body
    const opt = {
      resource: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/deployments/${deployName}/resources`,
      method: 'PATCH',
      payload: {
        clusterName,
        phases,
        appInstanceName
      },
      params: query,
      token
    }

    const result = await this.request(opt)

    return result
  }

  async cancelCanary(params: ApiDeployPathParams, body: CancelCanaryDeployBody, token: string) {
    const { tenantId, projectName, appName } = params
    const { deploys } = body
    const opt = {
      resource: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/deployments:cancelCanary`,
      method: 'POST',
      payload: {
        deploys: deploys.map((deploy) => {
          return {
            ...deploy,
            deployName: deploy.name
          }
        })
      },
      token
    }

    const result = await this.request(opt)

    return result
  }

  async fullRelease(params: ApiDeployPathParams, body: FullReleaseBody, token: string) {
    const { tenantId, projectName, appName } = params
    const { deploys } = body
    const opt = {
      resource: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/deployments:fullRelease`,
      method: 'POST',
      payload: {
        deploys: deploys.map((deploy) => {
          return {
            ...deploy,
            deployName: deploy.name
          }
        })
      },
      token
    }

    const result = await this.request(opt)

    return result
  }

  async rollback(params: RollbackDeploymentRequestParamsDto, body: RollbackDeploymentRequestBodyDto, token: string) {
    const { tenantId, projectName, appName } = params
    const { deploys } = body
    const opt = {
      resource: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/deployments:rollback`,
      method: 'POST',
      payload: {
        deploys: deploys.map((deploy) => {
          return {
            ...deploy,
            deployName: deploy.name
          }
        })
      },
      token
    }

    const result = await this.request(opt)

    return result
  }

  async rolloutRestart(
    params: RolloutRestartDeploymentRequestParamsDto,
    body: RolloutRestartDeploymentRequestBodyDto,
    token: string
  ) {
    const { tenantId, projectName, appName } = params
    const { deploys } = body
    const opt = {
      resource: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/deployments:rolloutRestart`,
      method: 'POST',
      payload: {
        deploys: deploys.map((deploy) => {
          return {
            ...deploy,
            deployName: deploy.name
          }
        })
      },
      token
    }

    const result = await this.request(opt)

    return result
  }

  async scale(params: ApiDeployPathParams, body: ScaleDeployBody, token: string) {
    const { tenantId, projectName, appName } = params
    const { deploys } = body
    const opt = {
      resource: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/deployments:scale`,
      method: 'POST',
      payload: {
        deploys: deploys.map((deploy) => {
          return {
            ...deploy,
            deployName: deploy.name
          }
        })
      },
      token
    }

    const result = await this.request(opt)

    return result
  }

  checkIsOam(applicationName: string): boolean {
    const globalConfig = this.configService.get<IGlobalConfig>('global')
    const { oamApplications } = globalConfig || {}

    if (!oamApplications || !Array.isArray(oamApplications)) {
      // global config oamApplications property not exist means not use oam
      return false
    } else if (oamApplications.length === 0) {
      // not oam applications white list, means all use oam
      return true
    } else {
      return oamApplications.includes(applicationName)
    }
  }

  async getClusterFlavors(clusterName: string, token: string) {
    const opt = {
      resource: `clusters/${clusterName}/flavors`,
      method: 'GET',
      token
    }

    const result = await this.request(opt)
    return result
  }

  async addClustersFlavors(request: AddClustersFlavorsRequest, token: string) {
    const opt = {
      resource: 'clusters/flavors',
      method: 'POST',
      payload: request,
      token
    }

    const result = await this.request(opt)
    return result
  }

  async updateClusterFlavors(request: UpdateClusterFlavorsRequest, clusterName: string, token: string) {
    const opt = {
      resource: `clusters/${clusterName}/flavors`,
      method: 'POST',
      payload: request,
      token
    }

    const result = await this.request(opt)
    return result
  }

  async getClusterQuotas(
    params: GetOrUpdateNameParamsDto,
    token: string
  ): Promise<IGetClusterQuotasResponseFromOpenApi> {
    const { clusterName } = params

    const opt = {
      resource: `clusters/${clusterName}/quotas`,
      method: 'GET',
      token
    }

    const result = await this.request(opt)

    return result
  }

  async updateClusterQuotas(params: GetOrUpdateNameParamsDto, body: ClusterUpdateQuotasBodyDto, token: string) {
    const { clusterName } = params

    const opt = {
      resource: `clusters/${clusterName}/quotas`,
      method: 'PUT',
      payload: {
        quotaConfigs: body.quotasConfig
      },
      token
    }

    const result = await this.request(opt)

    return result
  }

  async getDeployConfig(request: IGetDeployConfigRequest, token: string): Promise<IGetDeployConfigResponse> {
    const { tenantId, appName, projectName, env } = request

    const opt = {
      resource: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/env/${env}/getDeployConfig`,
      method: 'GET',
      token
    }
    let result = await this.request<IGetDeployConfigResponse>(opt)

    if (!result || result.code !== RESPONSE_CODE.SUCCESS) {
      return {} as IGetDeployConfigResponse
    }
    if (!result.version || result.version < 1) {
      const opt = {
        resource: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/env/${env}/initPreviewConfig`,
        method: 'GET',
        token
      }
      result = await this.request<IGetDeployConfigResponse>(opt)
    }
    return result
  }

  async updateDeployConfig(request: IUpdateDeployConfigRequest, token: string): Promise<IUpdateDeployConfigResponse> {
    const { tenantId, appName, projectName } = request

    const opt = {
      resource: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/deployConfig:createOrUpdate`,
      method: 'POST',
      payload: pick(request, ['email', 'env', 'template', 'strategy', 'deployAz', 'resources', 'version']),
      token
    }
    const result = await this.request<IUpdateDeployConfigResponse>(opt)
    return result
  }

  async getPodPreviousLog(request: IGetPodPreviousLogRequest, token: string): Promise<string> {
    const { tenantId, appName, projectName, podName, namespace } = request
    const opts = {
      resource: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/pods/${podName}/previousLog?namespace=${namespace}`,
      method: 'GET',
      token
    }
    const result = await this.request<IGetPodPreviousLogResponse>(opts)
    if (!result || result.code !== 0) {
      throw new Error(result?.message || 'get pod previous log fail')
    }
    return result.log
  }

  async listNamespaceOam(payload: IListNamespaceOamPayLoad, token: string): Promise<IOam[]> {
    const opts = {
      resource: 'appinsoam/listOAM',
      method: 'POST',
      payload,
      token
    }

    const result = await this.request<IListNamespaceOamResponse>(opts)
    if (!result || result.code !== 0) {
      throw new Error(
        result?.message ||
          `list oam in namespace ${payload.namespace} fail, request payload: ${JSON.stringify(payload)}`
      )
    }

    return result.items
  }

  async deleteDeployment(
    deleteDeploymentParam: DeleteDeploymentParam,
    deleteDeploymentQuery: DeleteDeploymentQuery,
    authToken: string
  ) {
    const { tenantId, projectName, appName, deployName } = deleteDeploymentParam
    const requestOption = {
      resource: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/deployment/${deployName}`,
      params: deleteDeploymentQuery,
      method: 'DELETE',
      token: authToken
    }

    const result = await this.request<IOpenApiBaseResponse>(requestOption)
    if (!result || result.code !== 0) {
      throw new Error(
        result?.message ||
          `delete deployment ${deployName} fail, request payload: ${JSON.stringify(deleteDeploymentQuery)}`
      )
    }

    return result
  }

  async createApplication(tenantId: string, projectName: string, applicationName: string, token: string) {
    const requestOption = {
      resource: `tenants/${tenantId}/projects/${projectName}/apps`,
      method: 'POST',
      payload: {
        name: applicationName
      },
      token
    }
    const result = await this.request<IOpenApiBaseResponse>(requestOption)
    if (!result || result.code !== 0) {
      throw new Error(result?.message || `create application ${applicationName} fail`)
    }
  }
}
