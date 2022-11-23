import { Headers } from 'got'
import { URLSearchParams } from 'url'

export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type SearchParams =
  | string
  | URLSearchParams
  | Record<string, string | number | boolean | null | undefined>
  | undefined
/**
 * 下面是本项目对外发请求的request方法的参数标准
 * 这些参数，request方法实现可能用不到，不去实现他们的作用，但是如果用到了，需要按照上面的注释来实现，使得使用人可以按照注释去传参
 */
export interface IRequestParams<
  TRequestQuery = SearchParams,
  TRequestBody = Record<string, unknown>,
  TSupportedMethods extends HttpVerb = HttpVerb,
> {
  /**
   * http动词，要求大写
   */
  method: TSupportedMethods
  /**
   * urlPrefix, apiVersion and resourceURI should be joined as full url
   * urlPrefix, apiVersion 和 resourceURI 会被拼接成完成的请求链接
   */
  urlPrefix?: string
  apiVersion?: string
  resourceURI?: string
  /**
   * http headers
   */
  headers?: Headers
  /**
   * URL参数
   * params should be append to url as query string
   */
  query?: TRequestQuery
  /**
   * 请求体
   * body is request body
   */
  body?: TRequestBody
  /**
   * token 是本项目的用户凭证，部分第三方api和本项目用的同一套鉴权系统，所以token有时候需要透传
   * node gateway auth token
   */
  token?: string

  /**
   * error位置
   */
  errorPath?: string
}
