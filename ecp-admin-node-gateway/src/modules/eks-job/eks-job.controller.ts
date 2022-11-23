import { Controller, Get, Query, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { EksJobService } from '@/modules/eks-job/eks-job.service'
import {
  EksListJobParams,
  EksListJobQuery,
  EksListJobsResponse,
} from '@/modules/eks-job/dto/eks-job.dto'

@ApiTags('EksJob')
@Controller('eks/clusters/:clusterId/jobs')
export class EksJobController {
  constructor(private readonly eksJobService: EksJobService) {}

  @Get()
  litJobs(
    @Param() params: EksListJobParams,
    @Query() query: EksListJobQuery,
  ): Promise<EksListJobsResponse> {
    return this.eksJobService.listJobs(params, query)
  }
}
