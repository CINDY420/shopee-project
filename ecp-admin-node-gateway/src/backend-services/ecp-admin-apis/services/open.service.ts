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

export interface IGetClusterBindStatusPath {
  cluster: string
}

export interface IMaintainClusterPath {
  cluster: string
}

export type IMaintainClusterBody = { maintaining?: boolean }

export type IBindClusterBody = types.IV2BindClusterRequest

export interface IListSduQuotaUsedQuery {
  az?: string
  segment?: string
  sdu?: string
  pageNo?: number
  pageSize?: number
}

export interface IGetSegmentQuotaQuery {
  az?: string
  segment?: string
  env?: string
}

export type IUpdateSegmentQuotaBody = types.IV2QuotaRequest

export type IUpdateTenantQuotaSwitchBody = types.IV2TenantQuotaSwitch

export interface IGetTenantQuotaByKeysQuery {
  az?: string
  segment?: string
  env?: string
  tenantId?: string
}

export type IUpdateTenantsQuotaBody = types.IV2TenantsQuota

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
    healthCheck: () =>
      request!<types.IV2HealthCheckResponse, never, never>({
        method: 'GET',
        resourceURI: 'admin/v2/check'
      }),
    getClusterBindStatus: (query: IGetClusterBindStatusPath) =>
      request!<types.IV2GetClusterBindStatusResponse, never, never>({
        method: 'GET',
        resourceURI: `admin/v2/cluster/${query.cluster}/bind_status`
      }),
    maintainCluster: (query: IMaintainClusterPath, payload: IMaintainClusterBody) =>
      request!<types.IV2MaintainClusterResponse, never, IMaintainClusterBody>({
        method: 'PUT',
        resourceURI: `admin/v2/cluster/${query.cluster}:maintain`,
        body: payload
      }),
    bindCluster: (payload: IBindClusterBody) =>
      request!<types.IV2BindClusterResponse, never, IBindClusterBody>({
        method: 'POST',
        resourceURI: 'admin/v2/cluster:bind',
        body: payload
      }),
    listSduQuotaUsed: (params: IListSduQuotaUsedQuery) =>
      request!<types.IV2GetSduQuotaResponse, IListSduQuotaUsedQuery, never>({
        method: 'GET',
        resourceURI: 'admin/v2/quota/sdu/used',
        query: params
      }),
    getSegmentQuota: (params: IGetSegmentQuotaQuery) =>
      request!<types.IV2SegmentQuotaResponse, IGetSegmentQuotaQuery, never>({
        method: 'GET',
        resourceURI: 'admin/v2/quota/segment',
        query: params
      }),
    updateSegmentQuota: (payload: IUpdateSegmentQuotaBody) =>
      request!<types.IV2OperationResponse, never, IUpdateSegmentQuotaBody>({
        method: 'POST',
        resourceURI: 'admin/v2/quota/segment',
        body: payload
      }),
    updateTenantQuotaSwitch: (payload: IUpdateTenantQuotaSwitchBody) =>
      request!<types.IV2OperationResponse, never, IUpdateTenantQuotaSwitchBody>({
        method: 'POST',
        resourceURI: 'admin/v2/quota/switch',
        body: payload
      }),
    getTenantQuotaByKeys: (params: IGetTenantQuotaByKeysQuery) =>
      request!<types.IV2GetQuotaResponse, IGetTenantQuotaByKeysQuery, never>({
        method: 'GET',
        resourceURI: 'admin/v2/quota/tenants',
        query: params
      }),
    updateTenantsQuota: (payload: IUpdateTenantsQuotaBody) =>
      request!<types.IV2OperationResponse, never, IUpdateTenantsQuotaBody>({
        method: 'POST',
        resourceURI: 'admin/v2/quota/tenants',
        body: payload
      })
  }
}
