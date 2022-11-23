import { ListAllZoneParams, ListAllZoneResponse } from '@/modules/zone/dto/list-all-zone.dto'
import { ZoneService } from '@/modules/zone/zone.service'
import { RequireLogin } from '@infra-node-kit/space-auth'
import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Zone')
@RequireLogin(true)
@Controller('services/:serviceName')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @Get('zones')
  listAllZone(@Param() listAllZoneParams: ListAllZoneParams): Promise<ListAllZoneResponse> {
    return this.zoneService.listAllZone(listAllZoneParams)
  }
}
