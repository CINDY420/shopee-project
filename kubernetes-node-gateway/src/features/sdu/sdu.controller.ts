import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SduService } from '@/features/sdu/sdu.service'
import {
  ListSdusParams,
  ListSdusQuery,
  ListSdusResponse,
  ListAllAzSdusParams,
  ListAllAzSdusResponse,
  GetSduAzsParams,
  GetSduAzsResponse,
} from '@/features/sdu/dto/sdu.dto'

/**
 * SDU(Service Data Unit): 把深圳的k8s平台和新加坡的Leap平台在deploy层面整合成SDU
 */

@ApiTags('SDU')
@Controller('tenants/:tenantId/projects/:projectName/applications/:appName')
export class SduController {
  constructor(private readonly sduService: SduService) {}

  @Get('sdus')
  listSdus(@Param() listSdusParams: ListSdusParams, @Query() listSdusQuery: ListSdusQuery): Promise<ListSdusResponse> {
    return this.sduService.listSdus(listSdusParams, listSdusQuery)
  }

  @Get('allAzSdus')
  listAllAzSdus(@Param() listAllAzSdusParams: ListAllAzSdusParams): Promise<ListAllAzSdusResponse> {
    return this.sduService.listAllAzSdus(listAllAzSdusParams)
  }

  @Get('sdus/:sduName')
  getSduAzs(@Param() getSduAzsParams: GetSduAzsParams): Promise<GetSduAzsResponse> {
    return this.sduService.getSduAzs(getSduAzsParams)
  }
}
