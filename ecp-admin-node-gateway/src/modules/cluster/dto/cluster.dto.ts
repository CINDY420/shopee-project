import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { ListQuery } from '@/helpers/query/list-query.dto'
import { Type } from 'class-transformer'

export class AddClusterBody {
  @IsNotEmpty()
  @IsString()
  clusterId: string

  @IsNotEmpty()
  @IsString()
  azV1: string

  @IsNotEmpty()
  @IsString()
  monitoringUrl: string

  @IsNotEmpty()
  @IsString()
  ecpVersion: string

  @IsOptional()
  @IsBoolean()
  useOam?: boolean

  @IsOptional()
  @IsBoolean()
  useQuota?: boolean
}

export class IQuota {
  used: number | undefined
  applied: number | undefined
  total: number | undefined
}

export class ClusterDetail {
  displayName: string
  clusterId: string
  clusterType: string
  azv1Key: string
  azv2Key: string
  segmentKey: string
  segmentName?: string
  labels: string[]
  nodeCount: number
  podCount: number
  status: string
  healthyStatus: string
  healthGalioMsg: string
  healthKamardaMsg: string
  createTime: string
  observabilityLink: string
  metrics?: {
    cpu: IQuota
    memory: IQuota
  }
  karmadaCluster: boolean
}

class ClusterFilterOptions {
  type: string[]
  status: string[]
  healthyStatus: string[]
}

export class ListClustersResponse {
  items: ClusterDetail[]
  filterOptions: ClusterFilterOptions
  totalCount: number
}
export class ListClustersQuery extends ListQuery {}

export class GetClusterDetailResponse extends ClusterDetail {}

export class GetClusterDetailParams {
  @IsNotEmpty()
  @IsString()
  clusterId: string
}

export class ListClusterMetasQuery {
  @IsOptional()
  @IsNumberString()
  pageNum: string

  @IsOptional()
  @IsNumberString()
  pageSize: string

  @IsOptional()
  @IsString()
  filterBy: string
}

export class ClusterMeta {
  descriptions?: string
  createTs?: string
  displayName?: string
  karmadaKubeConfig?: string
  segmentKey?: string
  azForDepconf?: string
  handleByGalio?: boolean
  ecpVersion?: string
  platform?: string
  uuid?: string
  clusterType?: string
  monitoringUrl?: string
  kubeApiserverType?: string
  azV1?: string
  azV2?: string
  regionKey?: string
  labels?: string[]
  kubeConfig?: string
}

export class ListClusterMetasResponse {
  total: number
  items: ClusterMeta[]
}

export class EnableKarmadaParams {
  @IsNotEmpty()
  @IsString()
  clusterId: string
}

export class EnableKarmadaBody {
  @IsNotEmpty()
  @IsString()
  scheduler: string

  @IsNotEmpty()
  @IsString()
  schedulerLease: string
}

export class EnableKarmadaResponse {}

class ETCDConfig {
  @IsNotEmpty()
  @IsString({ each: true })
  etcdIPs: string[]

  @IsOptional()
  @IsString()
  sslCA?: string

  @IsOptional()
  @IsString()
  sslCertificate?: string

  @IsOptional()
  @IsString()
  sslKey?: string
}

export class AddToEKSClusterBody {
  @IsNotEmpty()
  @IsString()
  serviceName: string

  @IsNotEmpty()
  @IsNumber()
  serviceId: number

  @IsNotEmpty()
  @IsString()
  displayName: string

  @IsNotEmpty()
  @IsString()
  azv2: string

  @IsNotEmpty()
  @IsString()
  azv2Key: string

  @IsNotEmpty()
  @IsString()
  segment: string

  @IsNotEmpty()
  @IsString()
  segmentKey: string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ETCDConfig)
  etcdConfig: ETCDConfig

  @IsOptional()
  @IsString({ each: true })
  labels?: string[]

  @IsOptional()
  @IsString()
  description?: string

  @IsString()
  kubeConfig: string

  @IsNotEmpty()
  @IsString()
  env: string

  @IsNotEmpty()
  @IsString()
  uuid: string

  @IsNotEmpty()
  @IsBoolean()
  deployedGalio: boolean

  @IsNotEmpty()
  @IsString()
  monitoringName: string
}
