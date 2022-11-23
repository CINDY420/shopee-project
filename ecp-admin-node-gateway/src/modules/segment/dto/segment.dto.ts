import { ListQuery } from '@/helpers/query/list-query.dto'
import { IsNotEmpty, IsString } from 'class-validator'

export class IQuota {
  used: number
  applied: number
  total: number
}

export enum Status {
  HIGH = 'High',
  NORMAL = 'Normal',
  LOW = 'Low',
}

export class GetSegmentParams {
  @IsNotEmpty()
  @IsString()
  segmentId: string
}

export class SegmentDetail {
  azName: string
  azKey?: string
  segmentKey?: string
  segmentId: string
  name: string
  labels: string[]
  region?: string
  status: Status
  property?: string
  type?: string
  cpu: IQuota
  memory: IQuota
  usedCPUPercentage: number
  appliedCPUPercentage: number
  usedMemoryPercentage: number
  appliedMemoryPercentage: number
}

export class ListSegmentsResponse {
  items: SegmentDetail[]
  total?: number
}

export class ListSegmentsQuery extends ListQuery {}
export class GetSegmentResponse extends SegmentDetail {}
