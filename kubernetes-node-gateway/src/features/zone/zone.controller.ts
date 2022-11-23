import { Controller, Get, Post, Param, Body, Query, Delete } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ZoneService } from '@/features/zone/zone.service'
import { ListZoneParams, ListZoneQuery, ListZoneResponse } from '@/features/zone/dto/list-zone.dto'
import { CreateZoneParams, CreateZoneBody } from '@/features/zone/dto/create-zone.dto'
import { DeleteZoneParams } from '@/features/zone/dto/delete-zone.dto'
import { ListAllZoneParams, ListAllZoneQuery, ListAllZoneResponse } from '@/features/zone/dto/list-all-zone.dto'
import { ListEnableZoneAZsParams, ListEnableZoneAZsResponse } from '@/features/zone/dto/list-enable-zone-azs.dto'

@ApiTags('Zone')
@Controller('tenants/:tenantId')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @Get('zones')
  listZone(@Param() listZoneParams: ListZoneParams, @Query() listZoneQuery: ListZoneQuery): Promise<ListZoneResponse> {
    return this.zoneService.listZone(listZoneParams, listZoneQuery)
  }

  @Get('zones/all')
  listAllZone(
    @Param() listAllZoneParams: ListAllZoneParams,
    @Query() listAllZoneQuery: ListAllZoneQuery,
  ): Promise<ListAllZoneResponse> {
    return this.zoneService.listAllZone(listAllZoneParams, listAllZoneQuery)
  }

  @Post('zone')
  createZone(@Param() createZoneParams: CreateZoneParams, @Body() createZoneBody: CreateZoneBody) {
    return this.zoneService.createZone(createZoneParams, createZoneBody)
  }

  @Delete('zone/:zoneName')
  deleteZone(@Param() deleteZoneParams: DeleteZoneParams) {
    return this.zoneService.deleteZone(deleteZoneParams)
  }

  @Get('zone/[:]enableZoneAZs')
  listEnableZoneAZs(@Param() _: ListEnableZoneAZsParams): Promise<ListEnableZoneAZsResponse> {
    return this.zoneService.listEnableZoneAZs()
  }
}
