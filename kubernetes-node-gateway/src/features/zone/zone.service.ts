import { Injectable } from '@nestjs/common'
import { OpenApiService } from '@/shared/open-api/open-api.service'
import { ListZoneParams, ListZoneQuery } from '@/features/zone/dto/list-zone.dto'
import { CreateZoneParams, CreateZoneBody } from '@/features/zone/dto/create-zone.dto'
import { DeleteZoneParams } from '@/features/zone/dto/delete-zone.dto'
import { Logger } from '@/common/utils/logger'
import { ListAllZoneParams, ListAllZoneQuery } from '@/features/zone/dto/list-all-zone.dto'

@Injectable()
export class ZoneService {
  constructor(private readonly openApiService: OpenApiService, private readonly logger: Logger) {
    this.logger.setContext(ZoneService.name)
  }

  async listZone(listZoneParams: ListZoneParams, listZoneQuery: ListZoneQuery) {
    const { tenantId } = listZoneParams
    const { offset = '0', limit = '10' } = listZoneQuery
    const pageSize = Number(limit)
    const pageNum = Number(offset) / pageSize + 1
    const data = await this.openApiService.listZone(tenantId, { pageSize, pageNum })

    const { total, lists } = data

    return {
      total,
      zones: lists,
    }
  }

  async listAllZone(listAllZoneParams: ListAllZoneParams, listAllZoneQuery: ListAllZoneQuery) {
    const { tenantId } = listAllZoneParams
    const zones = await this.openApiService.listAllZone(tenantId, listAllZoneQuery)

    return {
      zones,
    }
  }

  async createZone(createZoneParams: CreateZoneParams, createZoneBody: CreateZoneBody) {
    const data = await this.openApiService.createZone(createZoneParams, createZoneBody)

    return data
  }

  async deleteZone(deleteZoneParams: DeleteZoneParams) {
    const { tenantId, zoneName } = deleteZoneParams
    const data = await this.openApiService.deleteZone(tenantId, { zoneName })

    return data
  }

  async listEnableZoneAZs() {
    const { azs } = await this.openApiService.listEnableZoneAZs()

    return {
      azs,
    }
  }
}
