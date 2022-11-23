import { randomUUID } from 'crypto'
import { URL } from 'url'
import { promisify } from 'util'

import { Global, Injectable, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cookie, CookieJar } from 'tough-cookie'
import merge from 'deepmerge'
import urlJoin from 'url-join'
import got from 'got'
import type {
  OptionsOfJSONResponseBody,
  RequestError,
  HTTPError,
  MaxRedirectsError,
  TimeoutError,
  UnsupportedProtocolError,
} from 'got'

import { Logger } from '@/common/utils/logger'
import { tryCatch } from '@/common/utils/try-catch'

export type GotRequestRestApiError =
  | RequestError
  | TimeoutError
  | HTTPError
  | MaxRedirectsError
  | UnsupportedProtocolError

@Global()
@Injectable({ scope: Scope.TRANSIENT })
export class Http {
  private readonly options: OptionsOfJSONResponseBody
  private baseUrl = this.configService.get<string>('baseRequestURL') ?? ''

  constructor(private configService: ConfigService, private readonly logger: Logger) {
    this.options = {
      retry: 0,
      responseType: 'json',
      hooks: {
        afterResponse: [
          (response) => {
            const id = response.request.options.headers['x-request-id']
            if (typeof id === 'string') {
              this.logger.log(`[${id}][REQUEST COST TIME]: ${response.timings.phases.total}ms`)
            }
            return response
          },
        ],
      },
    }
    this.logger.setContext(Http.name)
  }

  private getFullUrl(requestUrl?: string | URL) {
    const baseUrl = this.baseUrl
    if (!requestUrl) {
      return baseUrl
    }
    const url = requestUrl.toString()

    let host = ''
    let pathname = ''
    try {
      ;({ host, pathname } = new URL(url))
    } catch (e) {
      pathname = url
    }
    // if [host] is still a empty string, [url] must be a path, so join it with options.baseUrl
    return host ? url : urlJoin(baseUrl ?? '', pathname)
  }

  setBaseURL(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async request<TResponseBody = any>(httpOptions: OptionsOfJSONResponseBody = {}) {
    const uuid = randomUUID()
    const options = merge<OptionsOfJSONResponseBody>(this.options, httpOptions)
    options.cookieJar = httpOptions.cookieJar
    options.url = this.getFullUrl(options.url)
    options.headers ??= {}
    options.headers['x-request-id'] = uuid
    options.timeout ??= this.configService.get<number>('global.http-timeout')

    this.logger.log(
      `[${uuid}][REQUEST START]:
            url => ${options.url},
            method => ${options.method},
            body => ${JSON.stringify(options.body)}}`,
    )
    const results = await tryCatch<TResponseBody, GotRequestRestApiError>(
      got(options).json<TResponseBody>(),
    )
    const result = results[0]
    const error = results[1]
    if (error) {
      this.logger.error(
        `[${uuid}][REQUEST ERROR]: ${error.stack}, [ERROR RESULT]: ${JSON.stringify(
          error.response?.body,
        )}`,
      )
    } else {
      this.logger.log(`[${uuid}][REQUEST SUCCESS]: ${JSON.stringify(result)}`)
    }
    return results
  }

  get<TResponseBody = any, TRequestBody extends Record<string, any> = any>(
    requestUrl: string | URL,
    data?: TRequestBody,
    httpOptions: Omit<OptionsOfJSONResponseBody, 'searchParams' | 'url' | 'method'> = {},
  ) {
    return this.request<TResponseBody>({
      ...httpOptions,
      searchParams: data,
      url: requestUrl,
      method: 'GET',
    })
  }

  post<TResponseBody = any, TRequest extends Record<string, any> = any>(
    requestUrl: string | URL,
    data?: TRequest,
    httpOptions: Omit<OptionsOfJSONResponseBody, 'url' | 'method'> = {},
  ) {
    return this.request<TResponseBody>({
      ...httpOptions,
      url: requestUrl,
      method: 'POST',
      json: data,
    })
  }

  put<TResponseBody = any, TRequestBody extends Record<string, any> = any>(
    requestUrl: string | URL,
    data?: TRequestBody,
    httpOptions: Omit<OptionsOfJSONResponseBody, 'searchParams' | 'url' | 'method'> = {},
  ) {
    return this.request<TResponseBody>({
      ...httpOptions,
      url: requestUrl,
      method: 'PUT',
      json: data,
    })
  }

  del<TResponseBody = any, TRequestBody extends Record<string, any> = any>(
    requestUrl: string | URL,
    data?: TRequestBody,
    httpOptions: Omit<OptionsOfJSONResponseBody, 'searchParams' | 'url' | 'method'> = {},
  ) {
    return this.request<TResponseBody>({
      ...httpOptions,
      searchParams: data,
      url: requestUrl,
      method: 'DELETE',
    })
  }

  static async generateSimpleCookie(cookie: string | Record<string, any>, host: string) {
    const cookieJar = new CookieJar()
    const setCookie = promisify(cookieJar.setCookie.bind(cookieJar))

    if (typeof cookie === 'string') {
      await setCookie(cookie, host)
    } else {
      for (const [key, value] of Object.entries(cookie)) {
        const cookieObject = new Cookie({ key, value })
        await setCookie(cookieObject, host)
      }
    }
    return cookieJar
  }
}
