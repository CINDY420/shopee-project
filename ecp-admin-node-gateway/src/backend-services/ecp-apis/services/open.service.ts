/* eslint-disable */
import * as types from './open.dto'
import { URLSearchParams } from 'node:url'
import axios from 'axios'

export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
export type SearchParams =
  | string
  | Record<string, string | number | boolean | null | undefined>
  | URLSearchParams

/**
 * The following is the parameter standard of the request method for [external requests] of this project
 * These parameters may not be used by the request method, but if they are used,
 * they need to be implemented according to the above comments, so that users can pass parameters
 * according to the comments
 */

export interface IRequestParams<
  TRequestQuery = SearchParams,
  TRequestBody = Record<string, unknown>,
  TSupportedMethods extends HttpVerb = HttpVerb
> {
  /**
   * http verb, CAPITALIZED
   */
  method: TSupportedMethods

  /**
   * urlPrefix, apiVersion and resourceURI should be use to join as full url
   */
  urlPrefix?: string

  resourceURI?: string

  apiVersion?: string

  /**
   * should be used as http headers
   */
  headers?: Record<string, string | string[] | undefined>

  /**
   * should be append to url as query string
   */
  query?: TRequestQuery

  /**
   * should be use as the request body
   */
  body?: TRequestBody

  /**
   * should be use in authorization token of the request
   */
  token?: string
}

export interface IListAppClusterConfigQuery {
  cmdbTenantId?: string
  pageNum?: number
  pageSize?: number
  filterBy?: string
}

export type IAddAppClusterConfigBody = types.IV2AddAppClusterConfigRequest

export interface IRemoveAppClusterConfigPath {
  id: string
}

export interface IListClusterDetailQuery {
  pageNum?: number
  pageSize?: number
  filterBy?: string
  orderBy?: string
  searchBy?: string
}

export interface IListClusterMetaQuery {
  pageNum?: number
  pageSize?: number
  filterBy?: string
}

export type IAddClusterMetaBody = types.IV2AddClusterMetaRequest

export interface IQueryClusterDetailPath {
  uuid: string
}

export interface IQueryClusterDetailQuery {
  needStatus?: boolean
}

export interface IListClusterNodesPath {
  uuid: string
}

export interface IListClusterNodesQuery {
  pageNum?: number
  pageSize?: number
  filterBy?: string
  orderBy?: string
  searchBy?: string
}

export type IQueryTargetClusterForSDUBody = types.IV2QueryTargetClusterForSDURequest

export type IQueryTargetClusterForServiceBody = types.IV2QueryTargetClusterForServiceRequest

export interface IListAzDetailQuery {
  env?: string
}

export interface IQueryAZMappingPath {
  azKey: string
}

export type ICreateDeploymentBody = types.IV2CreateDeploymentRequest

export interface IListServiceDeploymentsPath {
  sduName: string
}

export interface IListServiceDeploymentsQuery {
  withdetail?: boolean
}

export interface IGetDeploymentHistoryPath {
  sduName: string
  deployId: string
}

export interface IGetRollbackDeploymentPreviewPath {
  sduName: string
  deployId: string
}

export interface IGetRollbackDeploymentPreviewQuery {
  deploymentId?: string
}

export interface IGetServiceDeploymentMetaPath {
  sduName: string
  deployId: string
}

export interface IGetDeployResultPath {
  sduName: string
  deployId: string
}

export interface IDeploymentCancelCanaryPath {
  sduName: string
  deployId: string
}

export interface IDeploymentEditResourcePath {
  sduName: string
  deployId: string
}

export interface IDeploymentEditResourceQuery {
  cpu?: string
  memory?: string
}

export interface IFullReleaseDeploymentPath {
  sduName: string
  deployId: string
}

export interface IRestartDeploymentPath {
  sduName: string
  deployId: string
}

export type IRestartDeploymentBody = { phases?: string[] }

export interface IRollbackDeploymentPath {
  sduName: string
  deployId: string
}

export type IRollbackDeploymentBody = { deploymentId?: string; containers?: types.IV2Container[] }

export interface IScaleDeploymentPath {
  sduName: string
  deployId: string
}

export type IScaleDeploymentBody = {
  releaseReplicas?: number
  canaryReplicas?: number
  canaryValid?: boolean
}

export interface IStopDeploymentPath {
  sduName: string
  deployId: string
}

export interface ISuspendDeploymentPath {
  sduName: string
  deployId: string
}

export interface IBulkGetServiceDeploymentsPath {
  serviceName: string
}

export type IBulkGetServiceDeploymentsBody = { sdus?: string[] }

export interface IListWorkloadQuery {
  env?: string
}

export type IRetryCreatePVPVCBody = types.IV2RetryCreatePvPvcRequest

export interface IGetPVPVCPath {
  uuid: string
}

export interface IDeletePVPVCPath {
  uuid: string
}

export type IDeletePVPVCBody = {}

export type ICreatePVPVCBody = types.IV2CreatePvPvcRequest

export interface IListPVPVCPath {
  serviceId: string
}

export type IUpdatePVSecretBody = types.IV2UpdatePVSecretRequest

export type ICreatePVSecretBody = types.IV2CreatePVSecretRequest

export type IIsPVSecretExistBody = types.IV2IsPVSecretExistRequest

export interface IGetPVSecretPath {
  uuid: string
}

export interface IDeletePVSecretPath {
  uuid: string
}

export interface IListPVSecretPath {
  serviceId: string
}

export interface IGetSDUAzDRInfoPath {
  sduName: string
  az: string
}

export interface IGetSDUSummaryPath {
  sduName: string
}

export interface IStopResourceBySduPath {
  sduName: string
}

export interface IListAllSDUsSummaryQuery {
  sduName?: string
  filterBy?: string
  keyword?: string
  isGroup?: boolean
}

export interface IBulkGetSdusPath {
  serviceName: string
}

export interface IBulkGetSdusQuery {
  filterBy?: string
  keyword?: string
  isGroup?: boolean
}

export interface IListSDUsPath {
  serviceName: string
}

export interface IListSDUsQuery {
  filterBy?: string
  keyword?: string
  isGroup?: boolean
}

export interface IListSDUHpasPath {
  sduName: string
}

export interface IListSDUPodsPath {
  sduName: string
}

export interface IListSDUPodsQuery {
  filterBy?: string
}

export interface IGetPodDetailPath {
  sduName: string
  podName: string
}

export interface IGetPodDetailQuery {
  filterBy?: string
}

export interface IGetPodMetaPath {
  sduName: string
  podName: string
}

export interface IListDeploymentPodsPath {
  sduName: string
  deployId: string
}

export interface IGetPodsMetricsPath {
  sduName: string
  deployId: string
}

export type IGetPodsMetricsBody = { pods?: types.IV2SimplePod[] }

export interface IGetLogFileContentPath {
  sduName: string
  deployId: string
  podName: string
}

export type IGetLogFileContentBody = {
  hostIp?: string
  length?: string
  offset?: string
  path?: string
}

export interface IListPodLogFilesPath {
  sduName: string
  deployId: string
  podName: string
}

export type IListPodLogFilesBody = { hostIp?: string }

export interface IGetPodLogsPath {
  sduName: string
  deployId: string
  podName: string
}

export interface IGetPodLogsQuery {
  isPrevious?: boolean
  namespace?: string
  cluster?: string
}

export interface IKillPodPath {
  sduName: string
  deployId: string
  podName: string
}

export type IKillPodBody = { clusterName?: string; namespace?: string }

export interface IGetServiceDeploymentEventsPath {
  sduName: string
  deployId: string
}

export interface IGetServiceDeploymentEventsQuery {
  pageCount?: number
  pageNum?: number
  startTime?: number
  endTime?: number
  filter?: string
  order?: string
}

export interface IListDeployZonePath {
  serviceName: string
}

export interface IQueryECPTreePath {
  rootType: string
  rootKey: string
}

export interface IQueryECPTreeQuery {
  leafType?: string
}

type IRequest = <
  TResponseBody = unknown,
  TRequestParams = URLSearchParams,
  TRequestBody extends Record<string, any> | undefined = Record<string, unknown>
>(
  requestParams: IRequestParams<TRequestParams, TRequestBody>
) => Promise<TResponseBody>

export const openApiFunctions = (request?: IRequest) => {
  if (!request) {
    const instance = axios.create({ headers: { 'Content-Type': 'application/json' } })
    request = async <
      TResponseBody = unknown,
      TRequestParams = URLSearchParams,
      TRequestBody = Record<string, unknown>
    >(
      requestParams: IRequestParams<TRequestParams, TRequestBody>
    ): Promise<TResponseBody> => {
      const { method, body, query, resourceURI } = requestParams

      try {
        const { data } = await instance({
          url: resourceURI,
          method,
          params: query,
          data: body
        })
        return data
      } catch (error) {
        throw new Error('request error: ' + error)
      }
    }
  }

  return {
    listAppClusterConfig: (params: IListAppClusterConfigQuery) =>
      request!<types.IV2ListAppClusterConfigResponse, IListAppClusterConfigQuery, never>({
        method: 'GET',
        resourceURI: 'ecpapi/v2/appclusterconfig',
        query: params
      }),
    addAppClusterConfig: (payload: IAddAppClusterConfigBody) =>
      request!<types.IV2AddAppClusterConfigResponse, never, IAddAppClusterConfigBody>({
        method: 'POST',
        resourceURI: 'ecpapi/v2/appclusterconfig',
        body: payload
      }),
    removeAppClusterConfig: (query: IRemoveAppClusterConfigPath) =>
      request!<types.IV2RemoveAppClusterConfigResponse, never, never>({
        method: 'DELETE',
        resourceURI: `ecpapi/v2/appclusterconfig/${query.id}`
      }),
    listClusterDetail: (params: IListClusterDetailQuery) =>
      request!<types.IV2ListClusterDetailResponse, IListClusterDetailQuery, never>({
        method: 'GET',
        resourceURI: 'ecpapi/v2/clusterdetails',
        query: params
      }),
    listClusterMeta: (params: IListClusterMetaQuery) =>
      request!<types.IV2ListClusterMetaResponse, IListClusterMetaQuery, never>({
        method: 'GET',
        resourceURI: 'ecpapi/v2/clustermetas',
        query: params
      }),
    addClusterMeta: (payload: IAddClusterMetaBody) =>
      request!<types.IV2AddClusterMetaResponse, never, IAddClusterMetaBody>({
        method: 'POST',
        resourceURI: 'ecpapi/v2/clustermetas',
        body: payload
      }),
    queryClusterDetail: (query: IQueryClusterDetailPath, params: IQueryClusterDetailQuery) =>
      request!<types.IV2QueryClusterDetailResponse, IQueryClusterDetailQuery, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/clusters/${query.uuid}/detail`,
        query: params
      }),
    listClusterNodes: (query: IListClusterNodesPath, params: IListClusterNodesQuery) =>
      request!<types.IV2ListClusterNodesResponse, IListClusterNodesQuery, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/clusters/${query.uuid}/nodes`,
        query: params
      }),
    queryTargetClusterForSDU: (payload: IQueryTargetClusterForSDUBody) =>
      request!<types.IV2QueryTargetClusterForSDUResponse, never, IQueryTargetClusterForSDUBody>({
        method: 'POST',
        resourceURI: 'ecpapi/v2/targetclusters:forsdus',
        body: payload
      }),
    queryTargetClusterForService: (payload: IQueryTargetClusterForServiceBody) =>
      request!<
        types.IV2QueryTargetClusterForServiceResponse,
        never,
        IQueryTargetClusterForServiceBody
      >({
        method: 'POST',
        resourceURI: 'ecpapi/v2/targetclusters:forservice',
        body: payload
      }),
    listAzDetail: (params: IListAzDetailQuery) =>
      request!<types.IV2ListAzDetailResponse, IListAzDetailQuery, never>({
        method: 'GET',
        resourceURI: 'ecpapi/v2/azs',
        query: params
      }),
    queryAZMapping: (query: IQueryAZMappingPath) =>
      request!<types.IV2QueryAZMappingResponse, never, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/azs/${query.azKey}/mapping`
      }),
    healthCheck: () =>
      request!<types.IV2HealthCheckResponse, never, never>({
        method: 'GET',
        resourceURI: 'ecpapi/v2/check'
      }),
    createDeployment: (payload: ICreateDeploymentBody) =>
      request!<types.IV2CreateDeploymentResponse, never, ICreateDeploymentBody>({
        method: 'POST',
        resourceURI: 'ecpapi/v2/deployments',
        body: payload
      }),
    listServiceDeployments: (
      query: IListServiceDeploymentsPath,
      params: IListServiceDeploymentsQuery
    ) =>
      request!<types.IV2ListServiceDeploymentsResponse, IListServiceDeploymentsQuery, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys`,
        query: params
      }),
    getDeploymentHistory: (query: IGetDeploymentHistoryPath) =>
      request!<types.IV2GetDeploymentHistoryResponse, never, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}/deploy_history`
      }),
    getRollbackDeploymentPreview: (
      query: IGetRollbackDeploymentPreviewPath,
      params: IGetRollbackDeploymentPreviewQuery
    ) =>
      request!<
        types.IV2GetRollbackDeploymentPreviewResponse,
        IGetRollbackDeploymentPreviewQuery,
        never
      >({
        method: 'GET',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}/deploy_preview`,
        query: params
      }),
    getServiceDeploymentMeta: (query: IGetServiceDeploymentMetaPath) =>
      request!<types.IV2GetServiceDeploymentMetaResponse, never, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}/meta`
      }),
    getDeployResult: (query: IGetDeployResultPath) =>
      request!<types.IV2GetDeployResultResponse, never, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}/result`
      }),
    deploymentCancelCanary: (query: IDeploymentCancelCanaryPath) =>
      request!<types.IV2DeploymentCancelCanaryResponse, never, never>({
        method: 'POST',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}:cancelcanary`
      }),
    deploymentEditResource: (
      query: IDeploymentEditResourcePath,
      params: IDeploymentEditResourceQuery
    ) =>
      request!<types.IV2DeploymentEditResourceResponse, IDeploymentEditResourceQuery, never>({
        method: 'POST',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}:editresource`,
        query: params
      }),
    fullReleaseDeployment: (query: IFullReleaseDeploymentPath) =>
      request!<types.IV2FullReleaseDeploymentResponse, never, never>({
        method: 'POST',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}:fullrelease`
      }),
    restartDeployment: (query: IRestartDeploymentPath, payload: IRestartDeploymentBody) =>
      request!<types.IV2RestartDeploymentResponse, never, IRestartDeploymentBody>({
        method: 'POST',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}:restart`,
        body: payload
      }),
    rollbackDeployment: (query: IRollbackDeploymentPath, payload: IRollbackDeploymentBody) =>
      request!<types.IV2RollbackDeploymentResponse, never, IRollbackDeploymentBody>({
        method: 'POST',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}:rollback`,
        body: payload
      }),
    scaleDeployment: (query: IScaleDeploymentPath, payload: IScaleDeploymentBody) =>
      request!<types.IV2ScaleDeploymentResponse, never, IScaleDeploymentBody>({
        method: 'POST',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}:scale`,
        body: payload
      }),
    stopDeployment: (query: IStopDeploymentPath) =>
      request!<types.IV2StopDeploymentResponse, never, never>({
        method: 'POST',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}:stop`
      }),
    suspendDeployment: (query: ISuspendDeploymentPath) =>
      request!<types.IV2SuspendDeploymentResponse, never, never>({
        method: 'POST',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}:suspend`
      }),
    bulkGetServiceDeployments: (
      query: IBulkGetServiceDeploymentsPath,
      payload: IBulkGetServiceDeploymentsBody
    ) =>
      request!<types.IV2BulkGetServiceDeploymentsResponse, never, IBulkGetServiceDeploymentsBody>({
        method: 'POST',
        resourceURI: `ecpapi/v2/services/${query.serviceName}/bulk_get_deployments`,
        body: payload
      }),
    listWorkload: (params: IListWorkloadQuery) =>
      request!<types.IV2ListWorkloadResponse, IListWorkloadQuery, never>({
        method: 'GET',
        resourceURI: 'ecpapi/v2/workloads',
        query: params
      }),
    queryECPEnumerations: () =>
      request!<types.IV2QueryECPEnumerationsResponse, never, never>({
        method: 'GET',
        resourceURI: 'ecpapi/v2/enums'
      }),
    retryCreatePVPVC: (payload: IRetryCreatePVPVCBody) =>
      request!<types.IV2RetryCreatePvPvcResponse, never, IRetryCreatePVPVCBody>({
        method: 'POST',
        resourceURI: 'ecpapi/v2/pvpvc',
        body: payload
      }),
    getPVPVC: (query: IGetPVPVCPath) =>
      request!<types.IV2PvPvc, never, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/pvpvc/${query.uuid}`
      }),
    deletePVPVC: (query: IDeletePVPVCPath, payload: IDeletePVPVCBody) =>
      request!<types.IV2DeletePVPVCResponse, never, IDeletePVPVCBody>({
        method: 'DELETE',
        resourceURI: `ecpapi/v2/pvpvc/${query.uuid}`,
        body: payload
      }),
    createPVPVC: (payload: ICreatePVPVCBody) =>
      request!<types.IV2CreatePvPvcResponse, never, ICreatePVPVCBody>({
        method: 'POST',
        resourceURI: 'ecpapi/v2/pvpvcs',
        body: payload
      }),
    listPVPVC: (query: IListPVPVCPath) =>
      request!<types.IV2ListPVPVCResponse, never, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/pvpvcs/${query.serviceId}`
      }),
    updatePVSecret: (payload: IUpdatePVSecretBody) =>
      request!<types.IV2UpdatePVSecretResponse, never, IUpdatePVSecretBody>({
        method: 'PUT',
        resourceURI: 'ecpapi/v2/pvsecret',
        body: payload
      }),
    createPVSecret: (payload: ICreatePVSecretBody) =>
      request!<types.IV2CreatePVSecretResponse, never, ICreatePVSecretBody>({
        method: 'POST',
        resourceURI: 'ecpapi/v2/pvsecret',
        body: payload
      }),
    isPVSecretExist: (payload: IIsPVSecretExistBody) =>
      request!<types.IV2IsPVSecretExistResponse, never, IIsPVSecretExistBody>({
        method: 'POST',
        resourceURI: 'ecpapi/v2/pvsecret/isexist',
        body: payload
      }),
    getPVSecret: (query: IGetPVSecretPath) =>
      request!<types.IV2PVSecret, never, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/pvsecret/${query.uuid}`
      }),
    deletePVSecret: (query: IDeletePVSecretPath) =>
      request!<types.IV2DeletePVSecretResponse, never, never>({
        method: 'DELETE',
        resourceURI: `ecpapi/v2/pvsecret/${query.uuid}`
      }),
    listPVSecret: (query: IListPVSecretPath) =>
      request!<types.IV2ListPVSecretResponse, never, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/pvsecrets/${query.serviceId}`
      }),
    getSDUAzDRInfo: (query: IGetSDUAzDRInfoPath) =>
      request!<types.IV2GetSDUAzDRInfoResponse, never, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/az/${query.az}/dr_info`
      }),
    getSDUSummary: (query: IGetSDUSummaryPath) =>
      request!<types.IV2GetSDUSummaryResponse, never, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/summary`
      }),
    stopResourceBySdu: (query: IStopResourceBySduPath) =>
      request!<types.IV2StopResourceBySduResponse, never, never>({
        method: 'POST',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys:stop`
      }),
    listAllSDUsSummary: (params: IListAllSDUsSummaryQuery) =>
      request!<types.IV2ListSDUsSummaryResponse, IListAllSDUsSummaryQuery, never>({
        method: 'GET',
        resourceURI: 'ecpapi/v2/services/sdus/summary',
        query: params
      }),
    bulkGetSdus: (query: IBulkGetSdusPath, params: IBulkGetSdusQuery) =>
      request!<types.IV2BulkGetSdusResponse, IBulkGetSdusQuery, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/services/${query.serviceName}/bulk_get_sdus`,
        query: params
      }),
    listSDUs: (query: IListSDUsPath, params: IListSDUsQuery) =>
      request!<types.IV2ListSDUsResponse, IListSDUsQuery, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/services/${query.serviceName}/sdus`,
        query: params
      }),
    listSDUHpas: (query: IListSDUHpasPath) =>
      request!<types.IV2ListSDUHpasResponse, never, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/hpas`
      }),
    listSDUPods: (query: IListSDUPodsPath, params: IListSDUPodsQuery) =>
      request!<types.IV2ListDeploymentPodsResponse, IListSDUPodsQuery, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/pods`,
        query: params
      }),
    getPodDetail: (query: IGetPodDetailPath, params: IGetPodDetailQuery) =>
      request!<types.IV2GetPodDetailResponse, IGetPodDetailQuery, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/pods/${query.podName}`,
        query: params
      }),
    getPodMeta: (query: IGetPodMetaPath) =>
      request!<types.IV2GetPodMetaResponse, never, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/pods/${query.podName}/meta`
      }),
    listDeploymentPods: (query: IListDeploymentPodsPath) =>
      request!<types.IV2ListDeploymentPodsResponse, never, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}/pods`
      }),
    getPodsMetrics: (query: IGetPodsMetricsPath, payload: IGetPodsMetricsBody) =>
      request!<types.IV2GetPodsMetricsResponse, never, IGetPodsMetricsBody>({
        method: 'POST',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}/pods/metrics`,
        body: payload
      }),
    getLogFileContent: (query: IGetLogFileContentPath, payload: IGetLogFileContentBody) =>
      request!<types.IV2GetLogFileContentResponse, never, IGetLogFileContentBody>({
        method: 'POST',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}/pods/${query.podName}/file:read`,
        body: payload
      }),
    listPodLogFiles: (query: IListPodLogFilesPath, payload: IListPodLogFilesBody) =>
      request!<types.IV2ListPodLogFilesResponse, never, IListPodLogFilesBody>({
        method: 'POST',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}/pods/${query.podName}/files`,
        body: payload
      }),
    getPodLogs: (query: IGetPodLogsPath, params: IGetPodLogsQuery) =>
      request!<types.IV2GetPodLogsResponse, IGetPodLogsQuery, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}/pods/${query.podName}/logs`,
        query: params
      }),
    killPod: (query: IKillPodPath, payload: IKillPodBody) =>
      request!<types.IV2KillPodResponse, never, IKillPodBody>({
        method: 'POST',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}/pods/${query.podName}:kill`,
        body: payload
      }),
    getServiceDeploymentEvents: (
      query: IGetServiceDeploymentEventsPath,
      params: IGetServiceDeploymentEventsQuery
    ) =>
      request!<
        types.IV2GetServiceDeploymentEventsResponse,
        IGetServiceDeploymentEventsQuery,
        never
      >({
        method: 'GET',
        resourceURI: `ecpapi/v2/sdus/${query.sduName}/svcdeploys/${query.deployId}/events`,
        query: params
      }),
    listDeployZone: (query: IListDeployZonePath) =>
      request!<types.IV2ListDeployZoneResponse, never, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/service/${query.serviceName}/deployzones`
      }),
    queryECPTree: (query: IQueryECPTreePath, params: IQueryECPTreeQuery) =>
      request!<types.IV2QueryECPTreeResponse, IQueryECPTreeQuery, never>({
        method: 'GET',
        resourceURI: `ecpapi/v2/tree/${query.rootType}/key/${query.rootKey}`,
        query: params
      })
  }
}
