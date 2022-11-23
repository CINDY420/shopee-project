import { constants as HTTP_CONSTANTS } from 'http2'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { ConfigService } from '@nestjs/config'
import { Http } from '@/common/utils/http'
import { Logger } from '@/common/utils/logger'
import { IServiceURLConfig } from '@/common/interfaces/config'
import { IRequestParams } from '@/common/interfaces/http'
import { AuthService } from '@/shared/auth/auth.service'
import { AuthInfoProvider } from '@/shared/auth/auth-info.provider'
import { throwError } from '@/common/utils/throw-error'
import { tryGetMessage } from '@/common/utils/try-get-message'
import { ERROR } from '@/common/constants/error'
import { IDeployConfig, IDeploymentDetail, IDeploymentInfo, IOpenApiResponse } from '@/shared/open-api/open-api.model'
import querystring from 'querystring'
import { GetDeployConfigParams, GetDeployConfigQuery } from '@/features/deploy-config/dto/get-deploy-config.dto'
import { UpdateDeployConfigBodyDto } from '@/features/deploy-config/dto/update-deploy-config.dto'
import { Components } from '@/features/deploy-config/entities/component.entity'
import {
  IOpenApiListAllTasksParams,
  IOpenApiListAllTasksResponse,
  IOpenApiListAllDeploymentHistoryParams,
  IOpenApiListAllDeploymentHistoryResponse,
} from '@/shared/open-api/interfaces/deployment'
import {
  IOpenApiGetApplicationParams,
  IOpenApiGetApplicationResponse,
  IOpenApiListAllApplicationsParams,
  IOpenApiListAllApplicationResponse,
} from '@/shared/open-api/interfaces/application'
import { IOpenApiListAllSdusParams, IOpenApiListAllSdusResponse } from '@/shared/open-api/interfaces/sdu'
import {
  IOpenApiListAllProjectsResponse,
  IOpenApiCreateProjectBody,
  IOpenApiMoveProjectBody,
} from '@/shared/open-api/interfaces/project'
import {
  IOpenApiCreateHpaParams,
  IOpenApiCreateHpaBody,
  IOpenApiUpdateHpaParams,
  IOpenApiUpdateHpaBody,
  IOpenApiGetHpaDetailParams,
  IOpenApiGetHpaDetailQuery,
  IOpenApiBatchEditHPARulesBody,
  IOpenApiBatchEditHPARulesParams,
  IOpenApiListHPARulesParams,
  OpenApiListHPARulesQuery,
  IOpenApiListHPARulesResponse,
  IOpenApiGetHpaDetailResponse,
  IOpenApiGetHpaDefaultConfigParams,
  IOpenApiGetHpaDefaultConfigQuery,
  IOpenApiGetHpaDefaultConfigResponse,
} from '@/shared/open-api/interfaces/hpa'

import {
  IOpenApiGetGlobalHpaParams,
  IOpenApiGetGlobalHpaResponse,
  IOpenApiUpdateGlobalHpaParams,
  IOpenApiUpdateGlobalHpaBody,
} from '@/shared/open-api/interfaces/cluster'
import { GetProjectParams, GetProjectResponse } from '@/features/project/dto/project.dto'
import { CreateZoneParams, CreateZoneBody } from '@/features/zone/dto/create-zone.dto'
import {
  IOpenApiDeleteZoneBody,
  IOpenApiListZoneQuery,
  IOpenApiListZoneResponse,
} from '@/shared/open-api/interfaces/zone'
import { AZ } from '@/features/global/entities/az.entity'
import { Zone } from '@/features/zone/entities/zone.entity'
import { ListEnableZoneAZsResponse } from '@/features/zone/dto/list-enable-zone-azs.dto'
import { ListAllZoneQuery } from '@/features/zone/dto/list-all-zone.dto'

@Injectable()
export class OpenApiService {
  private readonly openApiConfig = this.configService.get<IServiceURLConfig>('openApi')!

  constructor(
    private readonly configService: ConfigService,
    private readonly http: Http,
    private readonly logger: Logger,
    private readonly authService: AuthService,
    private readonly authInfoProvider: AuthInfoProvider,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    logger.setContext(OpenApiService.name)
    const { protocol, port, host } = this.openApiConfig
    const openApiServerURL = `${port ? `${protocol}://${host}:${port}` : `${protocol}://${host}`}/openapi/`
    this.http.setBaseURL(openApiServerURL)
  }

  private async request<
    TResponseBody = unknown,
    TRequestParams = URLSearchParams,
    TRequestBody = Record<string, unknown>,
  >(requestParams: Omit<IRequestParams<TRequestParams, TRequestBody>, 'token' | 'baseURL'>) {
    const { method, body, query, resourceURI, headers: incomingHeaders, apiVersion } = requestParams
    const token = this.authInfoProvider.getAuthToken()
    const tokenHeaders = token ? { [HTTP_CONSTANTS.HTTP2_HEADER_AUTHORIZATION]: `Bearer ${token}` } : {}
    const timeout = this.configService.get<number>('global.openapi-timeout')

    const [result, error] = await this.http.request<IOpenApiResponse<TResponseBody>>({
      url: `${apiVersion}/${resourceURI}`,
      method,
      searchParams: query ?? {},
      headers: {
        ...incomingHeaders,
        ...tokenHeaders,
      },
      json: body,
      timeout,
    })
    if (error || !result) {
      this.logger.error(error?.stack ?? 'unknown open api error')
      const errorMessage = tryGetMessage(error?.response?.body) || error?.message
      throwError(ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR, errorMessage ?? 'unknown error')
    }
    return result.data
  }

  public getDeploymentDetail(deploymentInfo: IDeploymentInfo) {
    const { tenantId, deploymentName, projectName, appName, cid, env, phase, clusterName } = deploymentInfo
    return this.request<IDeploymentDetail, string>({
      method: 'GET',
      resourceURI: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/deployments/${deploymentName}`,
      apiVersion: 'v1',
      query: querystring.encode({
        cid,
        env,
        phase,
        cluster: clusterName,
      }),
    })
  }

  public getEcpDeployConfig(params: GetDeployConfigParams & GetDeployConfigQuery) {
    const { tenantId, projectName, appName, env } = params
    return this.request<IDeployConfig>({
      method: 'GET',
      resourceURI: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/env/${env}/getEcpDeployConfig`,
      apiVersion: 'v1',
    })
  }

  public updateEcpDeployConfig(params: GetDeployConfigParams, body: UpdateDeployConfigBodyDto) {
    const { tenantId, projectName, appName } = params
    const { comment, env, version, deployConfig } = body

    return this.request({
      method: 'POST',
      resourceURI: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/deployConfig:updateEcp`,
      apiVersion: 'v1',
      body: {
        comment,
        env,
        version,
        data: deployConfig,
      },
    })
  }

  public listAvailableZones(env?: string) {
    return this.request<AZ[], { env?: string }>({
      method: 'GET',
      resourceURI: `resource/az/azs`,
      apiVersion: 'v1',
      query: {
        env,
      },
    })
  }

  public listComponents(env: string) {
    return this.request<Record<string, Components>>({
      method: 'GET',
      resourceURI: `resource/env/${env}/components`,
      apiVersion: 'v1',
    })
  }

  // Project
  public listAllProjects(tenantId: string) {
    return this.request<IOpenApiListAllProjectsResponse>({
      method: 'GET',
      resourceURI: `tenants/${tenantId}/projects`,
      apiVersion: 'v1',
    })
  }

  public createProject(tenantId: string, body: IOpenApiCreateProjectBody) {
    return this.request<never, never, IOpenApiCreateProjectBody>({
      method: 'POST',
      resourceURI: `tenants/${tenantId}/projects`,
      apiVersion: 'v1',
      body,
    })
  }

  public moveProject(tenantId: string, projectName: string, body: IOpenApiMoveProjectBody) {
    return this.request<never, never, IOpenApiMoveProjectBody>({
      method: 'POST',
      resourceURI: `tenants/${tenantId}/projects/${projectName}/move`,
      apiVersion: 'v1',
      body,
    })
  }

  public getProject(params: GetProjectParams) {
    const { tenantId, projectName } = params
    return this.request<GetProjectResponse>({
      method: 'GET',
      resourceURI: `tenants/${tenantId}/projects/${projectName}`,
      apiVersion: 'v1',
    })
  }

  // Application
  public listAllApplications(params: IOpenApiListAllApplicationsParams) {
    const { tenantId, projectName } = params
    return this.request<IOpenApiListAllApplicationResponse>({
      method: 'GET',
      resourceURI: `tenants/${tenantId}/projects/${projectName}/applications`,
      apiVersion: 'v1',
    })
  }

  public getApplication(params: IOpenApiGetApplicationParams) {
    const { tenantId, projectName, appName } = params
    return this.request<IOpenApiGetApplicationResponse>({
      method: 'GET',
      resourceURI: `tenants/${tenantId}/projects/${projectName}/applications/${appName}`,
      apiVersion: 'v1',
    })
  }

  // SDU
  public listAllSdus(params: IOpenApiListAllSdusParams) {
    const { tenantId, projectName, appName } = params
    return this.request<IOpenApiListAllSdusResponse>({
      method: 'GET',
      resourceURI: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/sdus`,
      apiVersion: 'v1',
    })
  }

  // deployment
  public listAllTasks(params: IOpenApiListAllTasksParams, az: string) {
    const { tenantId, projectName, appName, sduName } = params
    return this.request<IOpenApiListAllTasksResponse, { az: string }>({
      method: 'GET',
      resourceURI: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/sdus/${sduName}/tasks`,
      apiVersion: 'v1',
      query: {
        az,
      },
    })
  }

  public listAllDeploymentHistory(params: IOpenApiListAllDeploymentHistoryParams, az: string) {
    const { tenantId, projectName, appName, sduName } = params
    return this.request<IOpenApiListAllDeploymentHistoryResponse, { az: string }>({
      method: 'GET',
      resourceURI: `tenants/${tenantId}/projects/${projectName}/applications/${appName}/sdus/${sduName}/history`,
      apiVersion: 'v1',
      query: {
        az,
      },
    })
  }

  // hpa
  public createHpa(params: IOpenApiCreateHpaParams, body: IOpenApiCreateHpaBody) {
    const { tenantId, projectName, appName } = params
    return this.request<never, never, IOpenApiCreateHpaBody>({
      method: 'POST',
      resourceURI: `tenants/${tenantId}/projects/${projectName}/apps/${appName}/hpa/create`,
      apiVersion: 'v1',
      body,
    })
  }

  public updateHpa(params: IOpenApiUpdateHpaParams, body: IOpenApiUpdateHpaBody) {
    const { tenantId, projectName, appName } = params
    return this.request<never, never, IOpenApiUpdateHpaBody>({
      method: 'POST',
      resourceURI: `tenants/${tenantId}/projects/${projectName}/apps/${appName}/hpa/update`,
      apiVersion: 'v1',
      body,
    })
  }

  public listHPARules(params: IOpenApiListHPARulesParams, query: OpenApiListHPARulesQuery) {
    const { tenantId, projectName, appName } = params
    const { offset, limit, filterBy, orderBy } = query

    return this.request<IOpenApiListHPARulesResponse, OpenApiListHPARulesQuery>({
      method: 'GET',
      resourceURI: `tenants/${tenantId}/projects/${projectName}/apps/${appName}/hpas`,
      apiVersion: 'v1',
      query: {
        offset,
        limit,
        filterBy,
        orderBy,
      },
    })
  }

  public batchEnableHPARules(params: IOpenApiBatchEditHPARulesParams, body: IOpenApiBatchEditHPARulesBody) {
    const { tenantId, projectName, appName } = params
    const { hpas } = body

    return this.request({
      method: 'POST',
      resourceURI: `tenants/${tenantId}/projects/${projectName}/apps/${appName}/hpa/enable`,
      apiVersion: 'v1',
      body: {
        hpas,
      },
    })
  }

  public batchDisableHPARules(params: IOpenApiBatchEditHPARulesParams, body: IOpenApiBatchEditHPARulesBody) {
    const { tenantId, projectName, appName } = params
    const { hpas } = body

    return this.request({
      method: 'POST',
      resourceURI: `tenants/${tenantId}/projects/${projectName}/apps/${appName}/hpa/disable`,
      apiVersion: 'v1',
      body: {
        hpas,
      },
    })
  }

  public batchDeleteHPARules(params: IOpenApiBatchEditHPARulesParams, body: IOpenApiBatchEditHPARulesBody) {
    const { tenantId, projectName, appName } = params
    const { hpas } = body

    return this.request({
      method: 'POST',
      resourceURI: `tenants/${tenantId}/projects/${projectName}/apps/${appName}/hpa/delete`,
      apiVersion: 'v1',
      body: {
        hpas,
      },
    })
  }

  public getGlobalHpa(params: IOpenApiGetGlobalHpaParams) {
    const { cluster } = params
    return this.request<IOpenApiGetGlobalHpaResponse>({
      method: 'GET',
      resourceURI: `cluster/${cluster}/hpa`,
      apiVersion: 'v1',
    })
  }

  public updateGlobalHpa(params: IOpenApiUpdateGlobalHpaParams, body: IOpenApiUpdateGlobalHpaBody) {
    const { cluster } = params
    return this.request<never, never, IOpenApiUpdateGlobalHpaBody>({
      method: 'POST',
      resourceURI: `cluster/${cluster}/hpa/update`,
      apiVersion: 'v1',
      body,
    })
  }

  public getHpaDefaultConfig(params: IOpenApiGetHpaDefaultConfigParams, query: IOpenApiGetHpaDefaultConfigQuery) {
    const { tenantId, projectName, appName } = params
    return this.request<IOpenApiGetHpaDefaultConfigResponse, IOpenApiGetHpaDefaultConfigQuery>({
      method: 'GET',
      resourceURI: `tenants/${tenantId}/projects/${projectName}/apps/${appName}/hpa/default`,
      apiVersion: 'v1',
      query,
    })
  }

  // zone
  public createZone(params: CreateZoneParams, body: CreateZoneBody) {
    const { tenantId } = params
    return this.request<never, CreateZoneParams, CreateZoneBody>({
      method: 'POST',
      resourceURI: `tenants/${tenantId}/zone/create`,
      apiVersion: 'v1',
      body,
    })
  }

  public listZone(tenantId: string, query: IOpenApiListZoneQuery) {
    return this.request<IOpenApiListZoneResponse, IOpenApiListZoneQuery>({
      method: 'GET',
      resourceURI: `tenants/${tenantId}/zones`,
      apiVersion: 'v1',
      query,
    })
  }

  public listAllZone(tenantId: string, query: ListAllZoneQuery) {
    return this.request<Zone[], ListAllZoneQuery>({
      method: 'GET',
      resourceURI: `tenants/${tenantId}/zones/all`,
      apiVersion: 'v1',
      query,
    })
  }

  public deleteZone(tenantId: string, body: IOpenApiDeleteZoneBody) {
    return this.request({
      method: 'POST',
      resourceURI: `tenants/${tenantId}/zone/delete`,
      apiVersion: 'v1',
      body,
    })
  }

  public getHpaDetail(params: IOpenApiGetHpaDetailParams, query: IOpenApiGetHpaDetailQuery) {
    const { tenantId, projectName, appName } = params
    return this.request<IOpenApiGetHpaDetailResponse, IOpenApiGetHpaDetailQuery>({
      method: 'GET',
      resourceURI: `tenants/${tenantId}/projects/${projectName}/apps/${appName}/hpa`,
      apiVersion: 'v1',
      query,
    })
  }

  public listEnableZoneAZs() {
    return this.request<ListEnableZoneAZsResponse>({
      method: 'GET',
      resourceURI: `resource/az/enable_zone_azs`,
      apiVersion: 'v1',
    })
  }
}
