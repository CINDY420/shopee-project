import { ApiTags } from '@nestjs/swagger'
import { Logger } from '@/common/utils/logger'
import { Controller, Get, Post, Param, Body } from '@nestjs/common'
import { ClusterService } from '@/features/cluster/cluster.service'
import {
  GetGlobalHpaParams,
  GetGlobalHpaResponse,
  UpdateGlobalHpaParams,
  UpdateGlobalHpaBody,
} from '@/features/cluster/dto/cluster.dto'

@ApiTags('Cluster')
@Controller()
export class ClusterController {
  constructor(private readonly clusterService: ClusterService, private readonly logger: Logger) {}

  @Get('clusters[:]specialClusterNames')
  listSpecialClusterNames(): string[] {
    return this.clusterService.getSpecialClusterNameList()
  }

  @Get('clusters/:cluster/hpa')
  GetGlobalHpa(@Param() getGlobalHpaParams: GetGlobalHpaParams): Promise<GetGlobalHpaResponse> {
    return this.clusterService.getGlobalHpa(getGlobalHpaParams)
  }

  @Post('clusters/:cluster/hpa/update')
  UpdateGlobalHpa(
    @Param() updateGlobalHpaParams: UpdateGlobalHpaParams,
    @Body() updateGlobalHpaBody: UpdateGlobalHpaBody,
  ): Promise<never> {
    return this.clusterService.updateGlobalHpa(updateGlobalHpaParams, updateGlobalHpaBody)
  }
}
