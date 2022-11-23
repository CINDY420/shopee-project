import { ERROR } from '@/helpers/constants/error'
import { tryGetMessage } from '@/helpers/utils/try-get-message'
import { FetchService } from '@/modules/fetch/fetch.service'
import { ListAllZoneParams } from '@/modules/zone/dto/list-all-zone.dto'
import { throwError } from '@infra-node-kit/exception'
import { CustomException } from '@infra-node-kit/exception/dist/models/custom-exception'
import { Injectable } from '@nestjs/common'
import { format } from 'util'
import { IModels as ICmdbModel } from '@/rapper/cmdb/request'
import { tryCatch } from '@infra/utils'

type ListAllZones = ICmdbModel['GET/ecpapi/v2/service/{serviceName}/deployzones']['Res']
@Injectable()
export class ZoneService {
  constructor(private readonly fetchService: FetchService) {}

  async listAllZone(listAllZoneParams: ListAllZoneParams) {
    const { serviceName } = listAllZoneParams

    const [data, listZonesError] = await tryCatch<ListAllZones, CustomException>(
      this.fetchService.cmdbFetch['GET/ecpapi/v2/service/{serviceName}/deployzones']({
        serviceName,
      }),
    )

    if (listZonesError) {
      const { message, status } = ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR
      const errorMessage = tryGetMessage(listZonesError?.response?.data)
      throwError({
        status,
        message: format(message, errorMessage),
        data: listZonesError?.response?.message,
      })
    }

    const { items } = data
    return {
      zones: items,
    }
  }
}
