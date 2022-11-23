/* eslint-disable */
import * as types from './open.dto'
import { URLSearchParams } from 'node:url'

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
  region?: string
  az?: string
  env?: string
}

export interface IGetClusterPath {
  clusterId: string
}

type IRequest = <
  TResponseBody = unknown,
  TRequestParams = URLSearchParams,
  TRequestBody = Record<string, unknown>
>(
  requestParams: IRequestParams<TRequestParams, TRequestBody>
) => Promise<TResponseBody>

export const openApiFunctions = (request: IRequest) => ({
  listEnvAzs: () =>
    request<types.IClusterListEnvAzsResponse, never, never>({
      method: 'GET',
      resourceURI: 'etcdeagle/v1/adm/az/list',
    }),
  listCluster: (params: IListClusterQuery) =>
    request<types.IClusterListClusterResponse, IListClusterQuery, never>({
      method: 'GET',
      resourceURI: 'etcdeagle/v1/adm/cluster/list',
      query: params
    }),
  getCluster: (params: IGetClusterPath, query: IListClusterQuery) =>
    request<types.IClusterDetailResponse, IListClusterQuery, never>({
      method: 'GET',
      resourceURI: `etcdeagle/v1/adm/cluster/detail/${params.clusterId}`,
      query
    }),
})
