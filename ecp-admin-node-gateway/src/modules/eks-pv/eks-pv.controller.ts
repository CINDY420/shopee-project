import { Controller, Get, Query, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { EksPvService } from '@/modules/eks-pv/eks-pv.service'
import {
  EksListPvParams,
  EksListPvQuery,
  EksListPvsResponse,
} from '@/modules/eks-pv/dto/eks-pv.dto'

@ApiTags('EksPv')
@Controller('eks/clusters/:clusterId')
export class EksPvController {
  constructor(private readonly eksPvService: EksPvService) {}

  @Get('pvs')
  litPvs(
    @Param() params: EksListPvParams,
    @Query() query: EksListPvQuery,
  ): Promise<EksListPvsResponse> {
    return this.eksPvService.listPvs(params, query)
  }
}
