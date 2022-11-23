import { IsNotEmpty, IsNumber } from 'class-validator'
import { ListQuery } from '@/helpers/query/list-query.dto'
import { Type } from 'class-transformer'
import { IJobSubJobStatus } from '@/backend-services/eks-apis/services/open.dto'
export class EksListJobParams {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  clusterId: number
}

export class EksListJobQuery extends ListQuery {}

export class EksJobItem {
  jobId: number
  event: string
  status: string
  startTime: string
  updateTime: string
  condition: IJobSubJobStatus[]
}

export class EksListJobsResponse {
  items: EksJobItem[]
  total: number
}
