import fetch from 'isomorphic-fetch'

import { redirectToLoginPage } from 'helpers/session'
import { localServer } from 'constants/server'
/* eslint-disable no-param-reassign -- old code, may be a new fetch function should be created */

const CONTENT_TYPE = {
  JSON: 'application/json',
  CSV: 'application/CSV',
  SHEET: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  CAST: 'application/x-asciicast',
}

const isError = (status: number) =>
  `${status}`.startsWith('4') || `${status}`.startsWith('5') || status === 307

export class HTTPError extends Error {
  code: number
  details: any

  constructor(message: string, code: number, details: any) {
    super(message)
    this.message = message
    this.code = code
    this.details = details
  }
}

const processPayloadWithContentType = (payload: any, contentType: any) => {
  switch (contentType) {
    case 'application/json': {
      return JSON.stringify(payload)
    }
    default: {
      return payload
    }
  }
}

const getResponseContentType = (response: Response) => response.headers.get('Content-Type')
const processResponse = (response: Response) => {
  const contentType = getResponseContentType(response)
  switch (contentType) {
    case CONTENT_TYPE.SHEET:
      return new Promise((resolve, reject) => {
        response
          .blob()
          .then((res) => {
            resolve({
              content: res,
              contentDisposition: response.headers.get('Content-Disposition'),
            })
          })
          .catch((err) => {
            reject(err)
          })
      })
    case CONTENT_TYPE.CAST:
      return response.text()
    default:
      return response.json()
  }
}

const responseHandler = async (response: Response) => {
  const status = response.status
  let body: Awaited<ReturnType<Response['json']>>
  switch (status) {
    case 503:
    case 502:
    case 501:
    case 500:
      body = await response.json()
      throw new HTTPError(body.message || 'Internal Server Error', status, [])
    case 401:
      return new HTTPError('Unauthorized', status, [])
    case 504:
      return new HTTPError('Bad Gateway', status, [])
    default:
      return processResponse(response)
  }
}

const queryParamsStringify = (params: object | undefined) => {
  let queryString = ''
  if (params) {
    const urlSearch = new window.URLSearchParams()
    Object.entries(params)
      .filter(([_unusedKey, value]) => typeof value !== 'undefined' && value !== null)
      .forEach(([key, value]) => {
        if (Array.isArray(value))
          value.forEach((v) => {
            urlSearch.append(key, v)
          })
        else urlSearch.append(key, value)
      })
    queryString = urlSearch.toString()
  }
  return queryString === '' ? '' : `?${queryString}`
}

interface IFetchParam {
  server?: string
  version?: string
  resource?: string
  payload?: object
  params?: object
  contentType?: string
  method?: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT'
  headers?: object
  credentials?: string
  timeout?: number
}

/**
 * A wrapped fetch function with the ability of handling http errors
 * @param server Url
 * @param version Version of API
 * @param method Method of fetch
 * @param params Params used in url
 * @param timeout Abort fetch if no response is received within timeout seconds
 */

const HTTPFetch = ({
  server = process.env.__IS_LOCAL__ ? localServer : '',
  resource,
  method = 'GET',
  params,
  payload,
  contentType,
  credentials = 'include',
  headers = {},
  // 1 minute for default timeout
  timeout = 1000 * 60,
}: IFetchParam): any => {
  // let uri = server + '/api'
  let uri = server
  uri += resource ? `/${resource}` : ''
  uri += queryParamsStringify(params)

  if (payload) {
    if (!contentType) contentType = 'application/json'

    payload = processPayloadWithContentType(payload, contentType)
  }

  if (contentType)
    headers = {
      ...headers,
      'Content-Type': contentType,
    }

  const controller = new AbortController()
  const signal = controller.signal

  if (timeout)
    setTimeout(() => {
      controller.abort()
    }, timeout)

  let status: number

  return fetch(uri, { method, body: payload, headers, credentials, signal } as any)
    .then((response: Response) => {
      status = response.status
      return responseHandler(response)
    })
    .then((body: any) => ({ status, body }))
    .then(({ body }) => {
      if (status === 401) {
        redirectToLoginPage()
        throw new HTTPError('Unauthorized', status, [])
      } else if (status === 403) {
        /*
         * 路由页面通过判断user permission 进行跳转，不用通过接口状态码跳转了
         * const isOldUser = await hasRoles()
         * if (!isOldUser) {
         *   accessApplyRedirect()
         * }
         */

        const { detail } = body || {}

        if (isError(status)) throw new HTTPError('no permission', status, detail || [])

        return body
      } else if (status === 404) {
        const { message } = body || {}
        const errMessage = message || `Resource ${resource} Not Found`
        throw new HTTPError(errMessage, status, [])
      } else {
        if (isError(status)) throw new HTTPError(body.message, status, body.detail || [])

        /*
         * if (!body && !body.data)
         *   throw new HTTPError(body.message || 'empty data', status, body.detail || [])
         */

        return body?.data || body
      }
    })
    .catch((err: any) => {
      if (err.name === 'AbortError') throw new HTTPError('Request timeout', 408, null)

      throw err
    })
}

export default HTTPFetch
