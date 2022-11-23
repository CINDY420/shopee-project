import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { ListQuery } from '@/helpers/query/list-query.dto'
import { Type } from 'class-transformer'

export class EksListClustersQuery extends ListQuery {}
export class EksClusterItem {
  az: string
  createdTime: string
  env: string
  healthyStatus: string
  uuid: string
  displayName: string
  nodeCount: number
  nodeId: number
  serviceName: string
  observabilityLink: string
  segment: string
  status: string
  id: number
}
export class EksListClustersResponse {
  items: EksClusterItem[]
  total: number
  azList: string[]
  healthyStatusList: string[]
  servicesNameList: string[]
  statusList: string[]
  segmentList: string[]
}

export class EksGetClusterDetailParams {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  clusterId: number
}

export class EksGetClusterDetailResponse {
  healthyStatus: string
  clusterName: string
  status: string
  AZv2: string
  segment: string
  createTime: string
  kubeConfig: string
  env: string
  platformName: string
  nodeCount: number
}

class EKSClusterResourceInfo {
  @IsString()
  azName: string

  @IsString()
  azKey: string

  @IsString()
  segmentName: string

  @IsString()
  segmentKey: string

  @IsString()
  env: string

  @IsNumber()
  templateId: number

  @IsString({ each: true })
  service: string[]
}
class EKSClusterServerList {
  @IsString({ each: true })
  masterIPs: string[]

  @IsOptional()
  @IsString({ each: true })
  workIPs?: string[]
}
export class EKSClusterSpec {
  @IsString()
  clusterName: string

  @IsOptional()
  @IsString()
  platformName?: string

  @IsOptional()
  @IsNumber()
  platformId?: number

  @IsString()
  kubernetesVersion: string
}
export class EKSClusterETCD {
  @IsOptional()
  @IsString({ each: true })
  IPs?: string[]

  @IsString()
  authority: string

  @IsString()
  certification: string

  @IsString()
  key: string
}
export class EKSClusterNetworkingModel {
  @IsBoolean()
  enableVpcCNI: boolean

  @IsOptional()
  @IsString()
  vpc?: string

  @IsOptional()
  @IsString()
  anchorServer?: string
}
export class EKSClusterNetwork {
  @IsString()
  servicesCidrBlocks: string

  @IsOptional()
  @IsString()
  podCidrBlocks?: string

  @IsOptional()
  @IsNumber()
  nodeMask?: number
}
export class EKSClusterAdvance {
  @IsOptional()
  @IsBoolean()
  enableDragonfly?: boolean

  @IsOptional()
  @IsBoolean()
  enableGPU?: boolean

  @IsOptional()
  @IsString({ each: true })
  apiServerExtraArgs?: string[]

  @IsOptional()
  @IsString({ each: true })
  controllerManagementExtraArgs?: string[]

  @IsOptional()
  @IsString({ each: true })
  schedulerExtraArgs?: string[]

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EKSClusterETCD)
  eventEtcd: EKSClusterETCD

  @IsOptional()
  @IsBoolean()
  enableLog?: boolean

  @IsOptional()
  @IsBoolean()
  enableMonitoring?: boolean

  @IsOptional()
  @IsBoolean()
  enableBromo?: boolean
}

export class EKSCreateClusterBody {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EKSClusterResourceInfo)
  resourceInfo: EKSClusterResourceInfo

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EKSClusterServerList)
  serverList: EKSClusterServerList

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EKSClusterSpec)
  clusterSpec: EKSClusterSpec

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EKSClusterETCD)
  etcd: EKSClusterETCD

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EKSClusterNetworkingModel)
  networkingModel: EKSClusterNetworkingModel

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EKSClusterNetwork)
  clusterNetwork: EKSClusterNetwork

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EKSClusterAdvance)
  advance: EKSClusterAdvance
}

export class EKSCreateClusterResponse {
  id: number
  provisionJobId: number
}

export class GetClusterSummaryParams {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  clusterId: number
}

export class GetClusterSummaryResponse {
  totalCount: number
  notReadyCount: number
  podCount: number
  readyCount: number
  unknownCount: number
}

export class GetAnchorServerQuery {
  @IsString()
  @IsNotEmpty()
  env: string

  @IsString()
  @IsNotEmpty()
  az: string
}

export class GetAnchorServerResponse {
  address: string
}

export class GetClusterInfoByUuidResponse {
  healthyStatus: string
  clusterName: string
  status: string
  AZv2: string
  segment: string
  createTime: string
  kubeConfig: string
  id: number
}
export class GetClusterInfoByUuidParams {
  @IsString()
  uuid: string
}
