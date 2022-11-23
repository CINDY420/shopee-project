/* eslint-disable */
import * as types from './open.dto'
import { URLSearchParams } from 'node:url'
import axios, { AxiosRequestConfig, AxiosInstance } from 'axios'

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

export interface IListClusterQuery {
  labelSelector?: string
  fieldSelector?: string
  orderBy?: string
  fuzzySearch?: string
  pageNo?: number
  pageSize?: number
}

export type IPostClusterBody = types.IClusterCreateClusterReq

export type IAddExistClusterBody = types.IClusterAddClusterReq

export interface IGetClusterByUUIDSummaryPath {
  uuid: string
}

export interface IGetClusterPath {
  id: number
}

export interface IGetClusterSummaryPath {
  id: number
}

export interface IListNodeGroupPath {
  id: number
}

export interface IScaleUpNodeGroupPath {
  id: number
}

export type IScaleUpNodeGroupBody = types.INodegroupScaleNodeGroupReq

export interface IScaleDownNodeGroupPath {
  id: number
}

export type IScaleDownNodeGroupBody = types.INodegroupScaleNodeGroupReq

export interface IListJobsQuery {
  labelSelector?: string
  fieldSelector?: string
  pageNo?: number
  pageSize?: number
  clusterID?: number
}

export type IPostJobBody = types.IJobRerunJobReq

export interface IGetByClusterIDQuery {
  clusterID: number
}

export interface IGetJobPath {
  id: number
}

export interface IGetAnchorServerQuery {
  env: string
  az: string
}

export interface IListVPCQuery {
  platformID: number
  az: string
}

export interface IListProductsQuery {
  tenantName: string
}

export interface IListNodesPath {
  id: number
}

export interface IListNodesQuery {
  labelSelector?: string
  fieldSelector?: string
  pageNo?: number
  pageSize?: number
  fuzzySearch?: string
}

export interface ICordonPath {
  id: number
}

export type ICordonBody = types.INodeCordonReq

export interface IDrainPath {
  id: number
}

export type IDrainBody = types.INodeDrainReq

export interface IPostLabelsPath {
  id: number
}

export type IPostLabelsBody = types.INodeOperateNodeLabelsReq

export interface IPostTaintsPath {
  id: number
}

export type IPostTaintsBody = types.INodeOperateNodeTaintsReq

export interface IUncordonPath {
  id: number
}

export type IUncordonBody = types.INodeUncordonReq

export interface IListPVCNamespacesPath {
  id: number
}

export interface IListPVCNamespacesQuery {
  fuzzySearch?: string
}

export interface IListPVCsPath {
  id: number
}

export interface IListPVCsQuery {
  namespace?: string
  fieldSelector?: string
  fuzzySearch?: string
  pageNo?: number
  pageSize?: number
}

export interface IListPVsPath {
  id: number
}

export interface IListPVsQuery {
  fieldSelector?: string
  fuzzySearch?: string
  pageNo?: number
  pageSize?: number
}

export interface IListSecretsNamespacesPath {
  id: number
}

export interface IListSecretsNamespacesQuery {
  fuzzySearch?: string
}

export interface IGetSecretPath {
  id: number
}

export interface IGetSecretQuery {
  namespace: string
  secretname: string
  pageNo?: number
  pageSize?: number
}

export interface IListSecretsPath {
  id: number
}

export interface IListSecretsQuery {
  fieldSelector?: string
  namespace?: string
  fuzzySearch?: string
  pageNo?: number
  pageSize?: number
}

export interface IListSecretsTypesPath {
  id: number
}

export interface IListClusterTemplateQuery {
  labelSelector?: string
  fieldSelector?: string
  pageNo?: number
  pageSize?: number
}

export type IPostClusterTemplateBody = types.ITemplateCreateClusterTemplateReq

export interface IGetClusterTemplatePath {
  id: number
}

export interface IListNodeTemplateQuery {
  labelSelector?: string
  fieldSelector?: string
  pageNo?: number
  pageSize?: number
}

export type IPostWorkerBody = types.ITemplateCreateWorkerTemplateReq

export interface IGetWorkerPath {
  id: number
}

type IRequest = <
  TResponseBody = unknown,
  TRequestParams = URLSearchParams,
  TRequestBody extends Record<string, any> | undefined = Record<string, unknown>
>(
  requestParams: IRequestParams<TRequestParams, TRequestBody>
) => Promise<TResponseBody>
interface IAxiosRequestConfig extends AxiosRequestConfig {
  afterInstanceCreated?: (instance: AxiosInstance) => void
}

const isRequest = (request: IRequest | IAxiosRequestConfig): request is IRequest => {
  return typeof request === 'function'
}

export const openApiFunctions = (request?: IRequest | IAxiosRequestConfig) => {
  let requests: IRequest
  if (!request || (request && !isRequest(request))) {
    const { afterInstanceCreated, ...rest } = request ?? {}
    const instance = axios.create({
      ...{ headers: { 'Content-Type': 'application/json' } },
      ...rest
    })
    afterInstanceCreated?.(instance)
    requests = async (requestParams) => {
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
  } else {
    requests = request
  }

  return {
    listCluster: (params: IListClusterQuery) =>
      requests!<types.IClusterListClusterResponse, IListClusterQuery, never>({
        method: 'GET',
        resourceURI: 'v1/clusters',
        query: params
      }),
    postCluster: (payload: IPostClusterBody) =>
      requests!<types.IClusterCreateClusterResp, never, IPostClusterBody>({
        method: 'POST',
        resourceURI: 'v1/clusters',
        body: payload
      }),
    addExistCluster: (payload: IAddExistClusterBody) =>
      requests!<types.IClusterCreateClusterResp, never, IAddExistClusterBody>({
        method: 'POST',
        resourceURI: 'v1/clusters/add_exist',
        body: payload
      }),
    getSelectorInCluster: () =>
      requests!<types.IClusterListClusterSelectorsResponse, never, never>({
        method: 'GET',
        resourceURI: 'v1/clusters/selector'
      }),
    getClusterByUUIDSummary: (query: IGetClusterByUUIDSummaryPath) =>
      requests!<types.IClusterDetail, never, never>({
        method: 'GET',
        resourceURI: `v1/clusters/uuid/${query.uuid}`
      }),
    getK8sInCluster: () =>
      requests!<types.IClusterGetK8sVersionResponse, never, never>({
        method: 'GET',
        resourceURI: 'v1/clusters/version/k8s'
      }),
    getCluster: (query: IGetClusterPath) =>
      requests!<types.IClusterDetail, never, never>({
        method: 'GET',
        resourceURI: `v1/clusters/${query.id}`
      }),
    getClusterSummary: (query: IGetClusterSummaryPath) =>
      requests!<types.IResponseGetClusterSummaryResponse, never, never>({
        method: 'GET',
        resourceURI: `v1/clusters/${query.id}/summary`
      }),
    listNodeGroup: (query: IListNodeGroupPath) =>
      requests!<types.INodegroupListNodeGroupResp, never, never>({
        method: 'GET',
        resourceURI: `v1/clusters/${query.id}/nodegroups`
      }),
    scaleUpNodeGroup: (query: IScaleUpNodeGroupPath, payload: IScaleUpNodeGroupBody) =>
      requests!<types.INodegroupScaleNodeGroupResp, never, IScaleUpNodeGroupBody>({
        method: 'POST',
        resourceURI: `v1/clusters/${query.id}/nodegroups/nodes`,
        body: payload
      }),
    scaleDownNodeGroup: (query: IScaleDownNodeGroupPath, payload: IScaleDownNodeGroupBody) =>
      requests!<types.INodegroupScaleNodeGroupResp, never, IScaleDownNodeGroupBody>({
        method: 'DELETE',
        resourceURI: `v1/clusters/${query.id}/nodegroups/nodes`,
        body: payload
      }),
    listJobs: (params: IListJobsQuery) =>
      requests!<types.IJobListJobResponse, IListJobsQuery, never>({
        method: 'GET',
        resourceURI: 'v1/jobs',
        query: params
      }),
    postJob: (payload: IPostJobBody) =>
      requests!<types.IJobRerunJobReq, never, IPostJobBody>({
        method: 'POST',
        resourceURI: 'v1/jobs',
        body: payload
      }),
    getByClusterID: (params: IGetByClusterIDQuery) =>
      requests!<types.IModelBaseModel, IGetByClusterIDQuery, never>({
        method: 'GET',
        resourceURI: 'v1/jobs/by_cluster_id',
        query: params
      }),
    getJob: (query: IGetJobPath) =>
      requests!<types.IJobDetail, never, never>({
        method: 'GET',
        resourceURI: `v1/jobs/${query.id}`
      }),
    listAZs: () =>
      requests!<types.IMetaListAZResponse, never, never>({
        method: 'GET',
        resourceURI: 'v1/meta/az'
      }),
    listEnv: () =>
      requests!<types.IMetaListEnvResponse, never, never>({
        method: 'GET',
        resourceURI: 'v1/meta/env'
      }),
    listPlatforms: () =>
      requests!<types.IMetaListPlatformsResponse, never, never>({
        method: 'GET',
        resourceURI: 'v1/meta/platforms'
      }),
    getAnchorServer: (params: IGetAnchorServerQuery) =>
      requests!<types.IMetaGetAnchorServerResponse, IGetAnchorServerQuery, never>({
        method: 'GET',
        resourceURI: 'v1/meta/sdn/anchor_server',
        query: params
      }),
    listVPC: (params: IListVPCQuery) =>
      requests!<types.IMetaListVPCResponse, IListVPCQuery, never>({
        method: 'GET',
        resourceURI: 'v1/meta/sdn/vpc',
        query: params
      }),
    listProducts: (params: IListProductsQuery) =>
      requests!<types.IMetaListProductsResponse, IListProductsQuery, never>({
        method: 'GET',
        resourceURI: 'v1/meta/space/product',
        query: params
      }),
    listTenants: () =>
      requests!<types.IMetaListTenantsResponse, never, never>({
        method: 'GET',
        resourceURI: 'v1/meta/space/tenant'
      }),
    listNodes: (query: IListNodesPath, params: IListNodesQuery) =>
      requests!<types.IResponseListNodesResponse, IListNodesQuery, never>({
        method: 'GET',
        resourceURI: `v1/nodes/cluster/${query.id}`,
        query: params
      }),
    cordon: (query: ICordonPath, payload: ICordonBody) =>
      requests!<any, never, ICordonBody>({
        method: 'POST',
        resourceURI: `v1/nodes/cluster/${query.id}/cordon`,
        body: payload
      }),
    drain: (query: IDrainPath, payload: IDrainBody) =>
      requests!<any, never, IDrainBody>({
        method: 'POST',
        resourceURI: `v1/nodes/cluster/${query.id}/drain`,
        body: payload
      }),
    postLabels: (query: IPostLabelsPath, payload: IPostLabelsBody) =>
      requests!<any, never, IPostLabelsBody>({
        method: 'POST',
        resourceURI: `v1/nodes/cluster/${query.id}/labels`,
        body: payload
      }),
    postTaints: (query: IPostTaintsPath, payload: IPostTaintsBody) =>
      requests!<any, never, IPostTaintsBody>({
        method: 'POST',
        resourceURI: `v1/nodes/cluster/${query.id}/taints`,
        body: payload
      }),
    uncordon: (query: IUncordonPath, payload: IUncordonBody) =>
      requests!<any, never, IUncordonBody>({
        method: 'POST',
        resourceURI: `v1/nodes/cluster/${query.id}/uncordon`,
        body: payload
      }),
    getTaintEffect: () =>
      requests!<string[], never, never>({
        method: 'GET',
        resourceURI: 'v1/nodes/taint/effect'
      }),
    listPVCAccessModes: () =>
      requests!<types.IResponseListPVCAccessModesResponse, never, never>({
        method: 'GET',
        resourceURI: 'v1/pvcs/accessmodes'
      }),
    listPVCStatus: () =>
      requests!<types.IResponseListPVCStatusResponse, never, never>({
        method: 'GET',
        resourceURI: 'v1/pvcs/status'
      }),
    listPVCNamespaces: (query: IListPVCNamespacesPath, params: IListPVCNamespacesQuery) =>
      requests!<types.IResponseListPVCNamespacesResponse, IListPVCNamespacesQuery, never>({
        method: 'GET',
        resourceURI: `v1/pvcs/${query.id}/namespaces`,
        query: params
      }),
    listPVCs: (query: IListPVCsPath, params: IListPVCsQuery) =>
      requests!<types.IResponseListPVCsResponse, IListPVCsQuery, never>({
        method: 'GET',
        resourceURI: `v1/pvcs/${query.id}/pvcs`,
        query: params
      }),
    listPVAccessModes: () =>
      requests!<types.IResponseListPVAccessModesResponse, never, never>({
        method: 'GET',
        resourceURI: 'v1/pvs/accessmodes'
      }),
    listPVStatus: () =>
      requests!<types.IResponseListPVStatusResponse, never, never>({
        method: 'GET',
        resourceURI: 'v1/pvs/status'
      }),
    listPVs: (query: IListPVsPath, params: IListPVsQuery) =>
      requests!<types.IResponseListPVsResponse, IListPVsQuery, never>({
        method: 'GET',
        resourceURI: `v1/pvs/${query.id}/pvs`,
        query: params
      }),
    listSecretsNamespaces: (
      query: IListSecretsNamespacesPath,
      params: IListSecretsNamespacesQuery
    ) =>
      requests!<types.IResponseListSecretsNamespacesResponse, IListSecretsNamespacesQuery, never>({
        method: 'GET',
        resourceURI: `v1/secrets/${query.id}/namespaces`,
        query: params
      }),
    getSecret: (query: IGetSecretPath, params: IGetSecretQuery) =>
      requests!<types.IResponseGetSecretDetail, IGetSecretQuery, never>({
        method: 'GET',
        resourceURI: `v1/secrets/${query.id}/secret`,
        query: params
      }),
    listSecrets: (query: IListSecretsPath, params: IListSecretsQuery) =>
      requests!<types.IResponseListSecretsResponse, IListSecretsQuery, never>({
        method: 'GET',
        resourceURI: `v1/secrets/${query.id}/secrets`,
        query: params
      }),
    listSecretsTypes: (query: IListSecretsTypesPath) =>
      requests!<types.IResponseListSecretsTypesResponse, never, never>({
        method: 'GET',
        resourceURI: `v1/secrets/${query.id}/types`
      }),
    listClusterTemplate: (params: IListClusterTemplateQuery) =>
      requests!<types.ITemplateListClusterTemplateResponse, IListClusterTemplateQuery, never>({
        method: 'GET',
        resourceURI: 'v1/templates/cluster',
        query: params
      }),
    postClusterTemplate: (payload: IPostClusterTemplateBody) =>
      requests!<types.ITemplateCreateTemplateResp, never, IPostClusterTemplateBody>({
        method: 'POST',
        resourceURI: 'v1/templates/cluster',
        body: payload
      }),
    getClusterTemplate: (query: IGetClusterTemplatePath) =>
      requests!<types.ITemplateClusterTemplateDetail, never, never>({
        method: 'GET',
        resourceURI: `v1/templates/cluster/${query.id}`
      }),
    listNodeTemplate: (params: IListNodeTemplateQuery) =>
      requests!<types.ITemplateListClusterTemplateResponse, IListNodeTemplateQuery, never>({
        method: 'GET',
        resourceURI: 'v1/templates/node',
        query: params
      }),
    postWorker: (payload: IPostWorkerBody) =>
      requests!<types.ITemplateCreateTemplateResp, never, IPostWorkerBody>({
        method: 'POST',
        resourceURI: 'v1/templates/node',
        body: payload
      }),
    getWorker: (query: IGetWorkerPath) =>
      requests!<types.ITemplateWorkerTemplateDetail, never, never>({
        method: 'GET',
        resourceURI: `v1/templates/node/${query.id}`
      })
  }
}
