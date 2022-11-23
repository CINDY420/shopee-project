import https from 'https'
import { Injectable } from '@nestjs/common'
import { HttpService } from '@infra-node-kit/http'
import { logger } from '@infra-node-kit/logger'
import { tryCatch } from '@infra/utils'
import { FetchType } from '@infra/rapper/dist/runtime/commonLib'

import { ECP_APIS_ERROR } from '@/constants/error'
import { nodeKitThrowError } from '@/helpers/utils/throw-error'
import { handleAxiosError } from '@/helpers/response/errorHandlers'

import { EcpAdminConfigService } from '@/shared/config/config.service'
import { AuthInfoProvider } from '@/shared/auth/auth-info.provider'
import { fetch, createFetch } from '@/rapper/ecpApis/client'
import { IRequestParams, openApiFunctions } from '@/backend-services/ecp-apis/services/open.service'

const agent = new https.Agent({ rejectUnauthorized: false })
const ECP_API_REGISTER_HEADERS = { 'X-App-Name': 'ECP-ADMIN-BFF' }

@Injectable()
export class EcpApisService {
  constructor(
    private httpService: HttpService,
    private configService: EcpAdminConfigService,
    private authInfoProvider: AuthInfoProvider,
  ) {}

  getFetch(): typeof fetch {
    const baseURL = this.configService.getRapperURL('ecpApis')
    const spaceUser = this.authInfoProvider.getAuthUserInfo()

    return createFetch(
      async ({ url, method, params }) => {
        const [response, error] = await tryCatch(
          this.httpService.request({
            baseURL,
            method,
            url,
            params,
            data: params,
            headers: { Authorization: `Bearer ${spaceUser?.token}`, ...ECP_API_REGISTER_HEADERS },
            httpsAgent: agent,
          }),
        )

        if (!error) {
          return response?.data
        }

        handleAxiosError({
          error,
          serviceName: 'ECP apis',
          code: ECP_APIS_ERROR.REQUEST_FAILED_ERROR.code,
        })

        logger.error('[ECP apis Fetch] Catch unknown error: ')
        logger.stack(error)
        return nodeKitThrowError(ECP_APIS_ERROR.UNKNOWN_ERROR)
      },
      { fetchType: FetchType.AUTO },
    )
  }

  private async request<
    TResponseBody = unknown,
    TRequestParams = URLSearchParams,
    TRequestBody = Record<string, unknown>,
  >(requestParams: IRequestParams<TRequestParams, TRequestBody>) {
    const { method, headers, body, query, resourceURI } = requestParams
    const spaceUser = this.authInfoProvider.getAuthUserInfo()
    const baseURL = this.configService.getRapperURL('ecpApis')

    const [response, error] = await tryCatch(
      this.httpService.request<TResponseBody>({
        baseURL,
        method,
        url: resourceURI,
        params: query,
        data: body,
        headers: {
          Authorization: `Bearer ${spaceUser?.token}`,
          ...headers,
          ...ECP_API_REGISTER_HEADERS,
        },
        httpsAgent: agent,
      }),
    )

    if (!error) {
      return response.data
    }

    handleAxiosError({
      error,
      serviceName: 'ECP apis',
      code: ECP_APIS_ERROR.REQUEST_FAILED_ERROR.code,
    })

    logger.error('[ECP apis Fetch] Catch unknown error: ')
    logger.stack(error)
    return nodeKitThrowError(ECP_APIS_ERROR.UNKNOWN_ERROR)
  }

  getApis() {
    return openApiFunctions(this.request.bind(this))
  }
}
