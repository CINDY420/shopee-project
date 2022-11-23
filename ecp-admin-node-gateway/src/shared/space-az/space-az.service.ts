import https from 'https'
import axios from 'axios'
import { Injectable } from '@nestjs/common'
import { HttpService } from '@infra-node-kit/http'
import { logger } from '@infra-node-kit/logger'
import { tryCatch } from '@infra/utils'
import { FetchType } from '@infra/rapper/dist/runtime/commonLib'
import { SPACE_AZ_ERROR } from '@/constants/error'
import { fetch, createFetch } from '@/rapper/spaceAZ/client'
import { AuthInfoProvider } from '@/shared/auth/auth-info.provider'
import { EcpAdminConfigService } from '@/shared/config/config.service'
import { nodeKitThrowError, throwError } from '@/helpers/utils/throw-error'

const agent = new https.Agent({ rejectUnauthorized: false })

@Injectable()
export class SpaceAZService {
  constructor(
    private httpService: HttpService,
    private configService: EcpAdminConfigService,
    private authInfoProvider: AuthInfoProvider,
  ) {}

  getFetch(): typeof fetch {
    const baseURL = this.configService.getRapperURL('spaceAZ')
    const spaceUser = this.authInfoProvider.getAuthUserInfo()

    return createFetch(
      async ({ url, method, params }) => {
        const [response, error] = await tryCatch(
          this.httpService.request({
            baseURL,
            method,
            url,
            data: params,
            headers: { Authorization: `Bearer ${spaceUser?.token}` },
            httpsAgent: agent,
          }),
        )

        if (!error) {
          return response.data
        }

        if (axios.isAxiosError(error)) {
          return nodeKitThrowError({
            ...SPACE_AZ_ERROR.REQUEST_FAILED_ERROR,
            status: error?.response?.status,
            data: error?.response?.data,
          })
        }

        logger.error('[Space AZ Fetch] Catch unknown error: ')
        logger.stack(error)
        nodeKitThrowError(SPACE_AZ_ERROR.UNKNOWN_ERROR)
      },
      { fetchType: FetchType.AUTO },
    )
  }

  static getResult<TResult>(responseBody: { success?: boolean; result: TResult }, apiName: string) {
    if (!responseBody.success) {
      return throwError(
        SPACE_AZ_ERROR.SPACE_AZ_API_ERROR,
        apiName,
        JSON.stringify(responseBody.result),
      )
    }
    return responseBody.result
  }
}
