import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { EksPvcService } from '@/modules/eks-pvc/eks-pvc.service'
import {
  EksListPvcParams,
  EksListPvcQuery,
  EksListPvcResponse,
  EksGetPvcNamespaceParam,
  EksGetPvcNamespaceQuery,
  EksGetPvcNamespaceResponse,
} from '@/modules/eks-pvc/dto/eks-pvc.dto'

@ApiTags('EksPvc')
@Controller('eks/clusters/:clusterId')
export class EksPvcController {
  constructor(private readonly eksPvcService: EksPvcService) {}

  @Get('pvcs')
  listPvcs(
    @Param() params: EksListPvcParams,
    @Query() query: EksListPvcQuery,
  ): Promise<EksListPvcResponse> {
    return this.eksPvcService.listPvcs(params, query)
  }

  @Get('pvcNamespace')
  getPvcNameSpace(
    @Param() params: EksGetPvcNamespaceParam,
    @Query() query: EksGetPvcNamespaceQuery,
  ): Promise<EksGetPvcNamespaceResponse> {
    return this.eksPvcService.getPvcNameSpace(params, query)
  }
}
