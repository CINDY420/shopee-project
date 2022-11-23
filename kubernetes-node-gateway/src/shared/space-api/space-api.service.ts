import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Http } from '@/common/utils/http'
import { Logger } from '@/common/utils/logger'
import { IServiceURLConfig, ISpaceBot } from '@/common/interfaces/config'
import { IRequestParams } from '@/common/interfaces/http'
import { constants as HTTP_CONSTANTS } from 'http2'
import { tryGetMessage } from '@/common/utils/try-get-message'
import { throwError } from '@/common/utils/throw-error'
import { ERROR } from '@/common/constants/error'
import { IGetServiceNameByIdentifierResponse, IGetSpaceTokenResponse } from '@/shared/space-api/space-api.models'

@Injectable()
export class SpaceApiService {
  private readonly spaceApiConfig = this.configService.get<IServiceURLConfig>('spaceApi')!
  private readonly spaceBotConfig = this.configService.get<ISpaceBot>('spaceBot')!

  constructor(
    private readonly configService: ConfigService,
    private readonly http: Http,
    private readonly logger: Logger,
  ) {
    logger.setContext(SpaceApiService.name)
    const { protocol, host } = this.spaceApiConfig
    const openApiServerURL = `${protocol}://${host}`
    this.http.setBaseURL(openApiServerURL)
  }

  private async getSpaceToken() {
    const { username, password } = this.spaceBotConfig
    const [data, error] = await this.http.request<IGetSpaceTokenResponse>({
      url: 'apis/uic/v2/auth/basic_login',
      method: 'POST',
      username,
      password,
    })
    if (error) {
      this.logger.error(error?.stack ?? 'unknown space api error')
      const errorMessage = tryGetMessage(error?.response?.body) || error?.message
      throwError(ERROR.REMOTE_SERVICE_ERROR.SPACE_API_ERROR.REQUEST_ERROR, errorMessage ?? 'unknown error')
    }
    return data?.token
  }

  private async request<
    TResponseBody = unknown,
    TRequestParams = URLSearchParams,
    TRequestBody = Record<string, unknown>,
  >(requestParams: Omit<IRequestParams<TRequestParams, TRequestBody>, 'token' | 'baseURL'>) {
    const { method, body, query, resourceURI, headers: incomingHeaders, apiVersion } = requestParams
    const token = await this.getSpaceToken()
    const tokenHeaders = token ? { [HTTP_CONSTANTS.HTTP2_HEADER_AUTHORIZATION]: `Bearer ${token}` } : {}

    const [result, error] = await this.http.request<TResponseBody>({
      url: `${apiVersion}/${resourceURI}`,
      method,
      searchParams: query ?? {},
      headers: {
        ...incomingHeaders,
        ...tokenHeaders,
      },
      json: body,
    })
    if (error || !result) {
      this.logger.error(error?.stack ?? 'unknown space api error')
      const errorMessage = tryGetMessage(error?.response?.body) || error?.message
      throwError(ERROR.REMOTE_SERVICE_ERROR.SPACE_API_ERROR.REQUEST_ERROR, errorMessage ?? 'unknown error')
    }
    return result
  }

  public getServiceNameByIdentifier(identifier: string) {
    return this.request<IGetServiceNameByIdentifierResponse, { identifier: string }>({
      method: 'GET',
      resourceURI: 'service/container/get_service_by_identifier',
      apiVersion: 'apis/cmdb/v2',
      query: {
        identifier,
      },
    })
  }
}
