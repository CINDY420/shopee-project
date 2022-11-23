import { Injectable } from '@nestjs/common'
import { FetchService } from '@/modules/fetch/fetch.service'
import { IModels } from '@/rapper/cmdb/request'
import { ERROR } from '@/helpers/constants/error'
import { tryGetMessage } from '@/helpers/utils/try-get-message'
import { throwError } from '@infra-node-kit/exception'
import { tryCatchWithAuth } from '@/helpers/utils/try-catch-with-auth'
import { CustomException } from '@infra-node-kit/exception/dist/models/custom-exception'
import { format } from 'util'
import {
  ListPVsParam,
  CreatePVBody,
  CreatePVParam,
  ListPvSecretsParam,
  CheckIsPvSecretExistParam,
  CreatePvSecretBody,
  CreatePvSecretParam,
  UpdatePvSecretBody,
  UpdatePvSecretParam,
  ListAllPvSecretsQuery,
  ListAllPvSecretsParam,
  RetryCreatePVParam,
  RetryCreatePVBody,
  GetAllPvsParam,
  CheckIsPvSecretExistBody,
} from '@/modules/pv/dto/pv.dto'
import { FILTER_TYPE, ListQuery } from '@/helpers/models/list-query.dto'

type ListPVsModel = IModels['GET/ecpapi/v2/pvpvcs/{serviceId}']['Res']
type ListPvSecretsModel = IModels['GET/ecpapi/v2/pvsecrets/{serviceId}']['Res']
type CheckIsSecretExistModel = IModels['POST/ecpapi/v2/pvsecret/isexist']['Res']
type GetAzsModels = IModels['GET/ecpapi/v2/azs']['Res']

@Injectable()
export class PVService {
  constructor(private readonly fetchService: FetchService) {}

  async listPVs(param: ListPVsParam) {
    const { serviceId } = param
    const [data, error] = await tryCatchWithAuth<ListPVsModel, CustomException>(
      this.fetchService.cmdbFetch['GET/ecpapi/v2/pvpvcs/{serviceId}']({
        serviceId,
      }),
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
    const { pvPvc = [] } = data

    return {
      items: pvPvc,
      total: pvPvc.length,
    }
  }

  async createPV(param: CreatePVParam, body: CreatePVBody) {
    const [, error] = await tryCatchWithAuth<unknown, CustomException>(
      this.fetchService.cmdbFetch['POST/ecpapi/v2/pvpvcs']({
        ...param,
        ...body,
      }),
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

    return
  }

  async retryCreatePV(param: RetryCreatePVParam, body: RetryCreatePVBody) {
    const [, error] = await tryCatchWithAuth<unknown, CustomException>(
      this.fetchService.cmdbFetch['POST/ecpapi/v2/pvpvc']({
        ...param,
        ...body,
      }),
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

    return
  }

  async deletePV(uuid: string) {
    const [, error] = await tryCatchWithAuth<unknown, CustomException>(
      this.fetchService.cmdbFetch['DELETE/ecpapi/v2/pvpvc/{uuid}']({
        uuid,
      }),
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

    return
  }

  async listPvSevrets(param: ListPvSecretsParam) {
    const { serviceId } = param
    const [data, error] = await tryCatchWithAuth<ListPvSecretsModel, CustomException>(
      this.fetchService.cmdbFetch['GET/ecpapi/v2/pvsecrets/{serviceId}']({
        serviceId,
      }),
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
    const { pvSecret = [] } = data

    return {
      items: pvSecret,
      total: pvSecret.length,
    }
  }

  async listAllPvSevrets(param: ListAllPvSecretsParam, query: ListAllPvSecretsQuery) {
    const { serviceId } = param
    const { filterBy, orderBy = 'updatedAt desc' } = query
    const [data, error] = await tryCatchWithAuth<ListPvSecretsModel, CustomException>(
      this.fetchService.cmdbFetch['GET/ecpapi/v2/pvsecrets/{serviceId}']({
        serviceId,
      }),
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
    let items = data?.pvSecret || []
    if (filterBy) {
      const filterList = ListQuery.parseFilterBy(filterBy)
      items = ListQuery.getFilteredData(FILTER_TYPE.FILTER_BY, filterList, items)
    }
    items = items.sort(ListQuery.getCompareFunction(orderBy))

    return {
      items,
      total: items.length,
    }
  }

  async createPvSecret(param: CreatePvSecretParam, body: CreatePvSecretBody) {
    const [, error] = await tryCatchWithAuth<unknown, CustomException>(
      this.fetchService.cmdbFetch['POST/ecpapi/v2/pvsecret']({
        ...param,
        ...body,
      }),
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

    return
  }

  async updatePvSecret(param: UpdatePvSecretParam, body: UpdatePvSecretBody) {
    const [, error] = await tryCatchWithAuth<unknown, CustomException>(
      this.fetchService.cmdbFetch['PUT/ecpapi/v2/pvsecret']({
        ...param,
        ...body,
      }),
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

    return
  }

  async deletePvSecret(uuid: string) {
    const [, error] = await tryCatchWithAuth<unknown, CustomException>(
      this.fetchService.cmdbFetch['DELETE/ecpapi/v2/pvsecret/{uuid}']({
        uuid,
      }),
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

    return
  }

  async checkIsSecretExist(param: CheckIsPvSecretExistParam, body: CheckIsPvSecretExistBody) {
    const [data, error] = await tryCatchWithAuth<CheckIsSecretExistModel, CustomException>(
      this.fetchService.cmdbFetch['POST/ecpapi/v2/pvsecret/isexist']({
        ...param,
        ...body,
      }),
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

    return data
  }

  async getAllPvs(param: GetAllPvsParam) {
    const { items } = await this.listPVs(param)
    return { allPvs: items }
  }

  async getPvAzs() {
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

    const filterdAzs = data?.items?.filter((item) => item?.clusters?.length > 0)
    const azs = filterdAzs?.map((item) => item?.name)

    return { azs }
  }
}
