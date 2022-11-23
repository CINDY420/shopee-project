import https from 'https'
import axios from 'axios'
import { omit } from 'lodash'
import { Injectable } from '@nestjs/common'
import { HttpService } from '@infra-node-kit/http'
import { logger } from '@infra-node-kit/logger'
import { tryCatch } from '@infra/utils'
import { FetchType } from '@infra/rapper/dist/runtime/commonLib'

import { throwError, nodeKitThrowError } from '@/helpers/utils/throw-error'
import { fetch, createFetch } from '@/rapper/spaceCMDB/client'
import { AuthInfoProvider } from '@/shared/auth/auth-info.provider'
import { EcpAdminConfigService } from '@/shared/config/config.service'
import { SPACE_CMDB_ERROR } from '@/constants/error'
import { IModels } from '@/rapper/spaceCMDB/client/request'

const agent = new https.Agent({ rejectUnauthorized: false })

@Injectable()
export class SpaceCMDBService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: EcpAdminConfigService,
    private readonly authInfoProvider: AuthInfoProvider,
  ) {}

  getFetch(): typeof fetch {
    const baseURL = this.configService.getRapperURL('ecpCMDB')
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
            ...SPACE_CMDB_ERROR.REQUEST_FAILED_ERROR,
            status: error?.response?.status,
            data: error?.response?.data,
          })
        }

        logger.error('[Space CMDB Fetch] Catch unknown error: ')
        logger.stack(error)
        return nodeKitThrowError(SPACE_CMDB_ERROR.UNKNOWN_ERROR)
      },
      { fetchType: FetchType.AUTO },
    )
  }

  async tryFetch<TAPIName extends keyof IModels>(
    apiName: TAPIName,
    data?: IModels[TAPIName]['Req'],
  ) {
    const result = await this.getFetch()[apiName](data)
    if (!result.success) {
      throwError(SPACE_CMDB_ERROR.SPACE_CMDB_API_ERROR, apiName, result.business_code)
    }
    return omit(result, 'success', 'business_code')
  }
}
