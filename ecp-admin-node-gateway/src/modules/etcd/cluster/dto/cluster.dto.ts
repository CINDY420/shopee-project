import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ListQuery } from '@/helpers/query/list-query.dto'

export class ListEtcdClustersQuery extends ListQuery {
  @IsOptional()
  @IsString()
  env?: string

  @IsOptional()
  @IsString()
  az?: string

  @IsOptional()
  @IsString()
  region?: string

  @IsOptional()
  @IsString()
  labels?: string
}

export class ListEtcdEnvAzsResponse {
  azList: string[]
  envList: string[]
}

export class ListEtcdClustersResponse {
  items: EtcdClusterDetail[]
  total: number
}

export class EtcdClusterDetail {
  displayName: string
  region: string
  az: string
  env: string
  clusterId: number
  insecure: boolean
  status: string
  numOfRunningMembers: number
  numOfAllMembers: number
  monitoringPanelUrl: string
  labels: IEtcdLabel[]
}

export class IEtcdLabel {
  key: string
  value: string
}

export class GetEtcdClusterDetailQuery extends ListEtcdClustersQuery {}
export class GetEtcdClusterDetailParams {
  @IsNotEmpty()
  @IsString()
  clusterId: string
}

export class GetEtcdClusterDetailResponse {
  region: string
  az: string
  env: string
  clusterId: number
  insecure: boolean
  status: string
  numOfRunningMembers: number
  numOfAllMembers: number
  monitoringPanelUrl: string
  memberList: IEtcdMember[]
  statusCount: IEtcdStatusCount
  total: number
}

export class IEtcdMember {
  role: string
  status: string
  quotaSize: string
  peerPort: number
  clientPort: number
  ip: string
  conditions: IEtcdCondition[]
}

export class IEtcdCondition {
  type: string
  status: string
  lastTransitionTime: string
  reason: string
  message: string
}

export class IEtcdStatusCount {
  All: number
  Processing: number
  Pending: number
  Failed: number
  Running: number
  Unknown: number
}
