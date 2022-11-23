import { ClusterService } from '@/modules/cluster/cluster.service'
import { GetDisabledScaleClustersResponse } from '@/modules/cluster/dtos/getDisabledScaleCluster.dto'
import { RequireLogin } from '@infra-node-kit/space-auth'
import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Cluster')
@RequireLogin(true)
@Controller()
export class ClusterController {
  constructor(private clusterService: ClusterService) {}

  @Get('/cluster[:]disabledScaleClusters')
  getDisabledScaleClusters(): GetDisabledScaleClustersResponse {
    return this.clusterService.getDisabledScaleClusters()
  }
}
