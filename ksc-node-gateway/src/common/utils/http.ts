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
  ReadError,
  TimeoutError,
  UnsupportedProtocolError,
  UploadError,
} from 'got'

import { Logger } from '@/common/utils/logger'
import { tryCatch } from '@/common/utils/try-catch'

export type GotRequestRestApiError =
  | RequestError
  | TimeoutError
  | HTTPError
  | MaxRedirectsError
  | UnsupportedProtocolError
export type GotStreamError = RequestError | UnsupportedProtocolError | ReadError | TimeoutError | UploadError | Error

interface IServerConfiguration {
  serverName: string
  baseUrl: string
}

@Global()
@Injectable({ scope: Scope.TRANSIENT })
export class Http {
  private readonly options: OptionsOfJSONResponseBody
  private serverConfiguration: IServerConfiguration

  constructor(private configService: ConfigService, private readonly logger: Logger) {
    this.options = {
      retry: {
        limit: 1,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      },
      responseType: 'json',
      hooks: {
        afterResponse: [
          (response) => {
            const id = response.request.options.headers['x-request-id'] as string
            this.logger.log(
              `[${this.serverConfiguration.serverName}][${id}][REQUEST COST TIME]: ${response.timings.phases.total}ms`,
            )
            return response
          },
        ],
      },
    }
    this.logger.setContext(Http.name)
  }

  private getFullUrl(requestUrl?: string | URL) {
    const baseUrl = this.serverConfiguration.baseUrl
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

  public setServerConfiguration(serverConfiguration: IServerConfiguration) {
    this.serverConfiguration = serverConfiguration
  }

  public async request<TResponseBody = any>(httpOptions: OptionsOfJSONResponseBody = {}) {
    const uuid = randomUUID()
    const options = merge<OptionsOfJSONResponseBody>(this.options, httpOptions)
    options.cookieJar = httpOptions.cookieJar
    options.url = this.getFullUrl(options.url)
    options.headers ??= {}
    options.headers['x-request-id'] = uuid
    options.timeout = this.configService.get<number>('global.http-timeout')

    const results = await tryCatch<TResponseBody, GotRequestRestApiError>(got(options).json<TResponseBody>())
    const result = results[0]
    const error = results[1]
    if (error) {
      this.logger.error(`[${this.serverConfiguration.serverName}][${uuid}][REQUEST ERROR]: ${error.stack}`)
    } else {
      this.logger.log(`[${this.serverConfiguration.serverName}][${uuid}][REQUEST SUCCESS]: ${JSON.stringify(result)}`)
    }

    return results
  }

  public get<TResponseBody = any, TRequestBody extends Record<string, any> = any>(
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

  public post<TResponseBody = any, TRequest extends Record<string, any> = any>(
    requestUrl: string | URL,
    data?: TRequest,
    httpOptions: Omit<OptionsOfJSONResponseBody, 'searchParams' | 'url' | 'method'> = {},
  ) {
    return this.request<TResponseBody>({
      ...httpOptions,
      url: requestUrl,
      method: 'POST',
      json: data,
    })
  }

  public put<TResponseBody = any, TRequestBody extends Record<string, any> = any>(
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

  public del<TResponseBody = any, TRequestBody extends Record<string, any> = any>(
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

  public async generateSimpleCookie(cookie: string | Record<string, any>, host: string) {
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

export const extractResponseErrorMessage = (errorResponseBody: unknown, responseErrorMessageKey: string): string => {
  if (typeof errorResponseBody === 'string') {
    return errorResponseBody
  }
  if (
    typeof errorResponseBody === 'object' &&
    errorResponseBody !== null &&
    responseErrorMessageKey in errorResponseBody
  ) {
    const errorMessage = (errorResponseBody as any)[responseErrorMessageKey]
    return typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
  }
  return 'unknown error'
}
