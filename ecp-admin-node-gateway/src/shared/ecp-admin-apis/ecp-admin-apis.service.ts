import https from 'https'
import axios from 'axios'
import { Injectable } from '@nestjs/common'
import { HttpService } from '@infra-node-kit/http'
import { logger } from '@infra-node-kit/logger'
import { tryCatch } from '@infra/utils'

import { ECP_ADMIN_APIS_ERROR } from '@/constants/error'
import { nodeKitThrowError } from '@/helpers/utils/throw-error'
import { AuthInfoProvider } from '@/shared/auth/auth-info.provider'
import {
  IRequestParams,
  openApiFunctions,
} from '@/backend-services/ecp-admin-apis/services/open.service'
import { EcpAdminConfigService } from '@/shared/config/config.service'
import { get } from 'lodash'

const agent = new https.Agent({ rejectUnauthorized: false })

@Injectable()
export class EcpAdminApisService {
  constructor(
    private httpService: HttpService,
    private authInfoProvider: AuthInfoProvider,
    private configService: EcpAdminConfigService,
  ) {}

  private async request<
    TResponseBody = unknown,
    TRequestParams = URLSearchParams,
    TRequestBody = Record<string, unknown>,
  >(requestParams: IRequestParams<TRequestParams, TRequestBody>) {
    const { method, headers, body, query, resourceURI } = requestParams
    const spaceUser = this.authInfoProvider.getAuthUserInfo()
    const baseURL = this.configService.getRapperURL('ecpAdminApis')

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
        },
        httpsAgent: agent,
      }),
    )

    if (!error) {
      return response.data
    }

    if (axios.isAxiosError(error)) {
      return nodeKitThrowError({
        ...ECP_ADMIN_APIS_ERROR.REQUEST_FAILED_ERROR,
        status: error?.response?.status,
        data: error?.response?.data,
        message: `Request ECP admin apis service failed:${get(
          error,
          ['response', 'data', 'message'],
          'unknown error',
        )}`,
      })
    }

    logger.error('[ECP admin apis Fetch] Catch unknown error: ')
    logger.stack(error)
    return nodeKitThrowError(ECP_ADMIN_APIS_ERROR.UNKNOWN_ERROR)
  }

  getApis() {
    return openApiFunctions(this.request.bind(this))
  }
}
