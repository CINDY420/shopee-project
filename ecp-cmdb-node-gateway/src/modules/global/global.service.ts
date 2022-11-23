import { FetchService } from '@/modules/fetch/fetch.service'
import { Injectable } from '@nestjs/common'
import { IModels as ISpaceModles } from '@/rapper/space/request'
import { IModels as ICMDBModles } from '@/rapper/cmdb/request'
import { ERROR } from '@/helpers/constants/error'
import { tryGetMessage } from '@/helpers/utils/try-get-message'
import { throwError } from '@infra-node-kit/exception'
import { format } from 'util'
import { CustomException } from '@infra-node-kit/exception/dist/models/custom-exception'
import { tryCatchWithAuth } from '@/helpers/utils/try-catch-with-auth'
import { ConfigService } from '@nestjs/config'

type GetEnvsModels = ISpaceModles['GET/apis/envs/v2/get_envs']['Res']
type GetAzsModels = ICMDBModles['GET/ecpapi/v2/azs']['Res']
type GetCidsModels = ISpaceModles['GET/apis/envs/v2/get_cids']['Res']

@Injectable()
export class GlobalService {
  constructor(
    private readonly fetchService: FetchService,
    private readonly configService: ConfigService,
  ) {}

  async getEnvs() {
    const [data, error] = await tryCatchWithAuth<GetEnvsModels, CustomException>(
      this.fetchService.spaceFetch['GET/apis/envs/v2/get_envs'](),
    )
    if (error) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.SPACE_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(error?.response?.data, 'error_detailed')
      throwError({
        status,
        message: format(message, errorMessage),
        data: error?.response?.message,
      })
    }

    const envs = data?.result?.map((item) => item?.name)

    return { envs }
  }

  async getAzs() {
    const [data, error] = await tryCatchWithAuth<GetAzsModels, CustomException>(
      this.fetchService.cmdbFetch['GET/ecpapi/v2/azs'](),
    )
    if (error) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(error?.response?.data)
      throwError({
        status,
        message: format(message, errorMessage),
        data: error?.response?.message,
      })
    }

    const azs = data?.items?.map((item) => item?.name)

    return { azs }
  }

  async getCids() {
    const [data, error] = await tryCatchWithAuth<GetCidsModels, CustomException>(
      this.fetchService.spaceFetch['GET/apis/envs/v2/get_cids'](),
    )
    if (error) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.SPACE_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(error?.response?.data, 'error_detailed')
      throwError({
        status,
        message: format(message, errorMessage),
        data: error?.response?.message,
      })
    }
    const { result } = data

    const cids = result.filter((item) => item.visible).map((item) => item.name)

    return { cids }
  }

  listAnnouncements() {
    const announcements = this.configService.get<string[]>('ecpGlobalConfig.announcements') ?? []

    return {
      announcements,
      total: announcements.length,
    }
  }

  listNewDeplouConfigTenants() {
    const tenants = this.configService.get<number[]>('ecpGlobalConfig.newDeployConfigTenants') ?? []

    return {
      tenants,
      total: tenants.length,
    }
  }
}
