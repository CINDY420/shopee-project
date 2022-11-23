import {
  IsNumber,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import {
  IClustermanagerCommonResouce,
  IClustermanagerCommonLabel,
  IClustermanagerCommonTaint,
} from '@/backend-services/eks-apis/services/open.dto'
import { ListQuery } from '@/helpers/query/list-query.dto'
import { Type } from 'class-transformer'

export class EksListNodesParams {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  clusterId: number
}

export class EksListNodesQuery extends ListQuery {
  @IsOptional()
  @IsString()
  labelSelector?: string
}

export class Label extends IClustermanagerCommonLabel {}
export class Taint extends IClustermanagerCommonTaint {}

export class EKsNodeMetricsSpec extends IClustermanagerCommonResouce {}

export class EksNodeCondition {
  message: string
  meta: string
  reason: string
  severity: string
  status: string
  updateTime: string
}

export class EksNodeItem {
  nodeName: string
  privateIp: string
  status: string
  roles: string[]
  labels: Label[]
  taints: Taint[]
  cpu: EKsNodeMetricsSpec
  memory: EKsNodeMetricsSpec
  disk: EKsNodeMetricsSpec
  gpu: EKsNodeMetricsSpec
  podSummary: EKsNodeMetricsSpec
  nodeGroup: number
  nodeGroupName: string
  schedulingStatus: string
  condition: EksNodeCondition[]
}

export class EksListNodesResponse {
  items: EksNodeItem[]
  total: number
  rolesList: string[]
  allSchedulingStatus: string[]
}

export class EksCordonNodesParams extends EksListNodesParams {}

export class EksCordonNodesBody {
  @IsArray()
  @IsNotEmpty()
  nodeNames: string[]
}

export class EksUnCordonNodesParams extends EksListNodesParams {}
export class EksUnCordonNodesBody extends EksCordonNodesBody {}

export class EksDrainNodesParams extends EksListNodesParams {}
export class EksDrainNodesBody extends EksCordonNodesBody {}

export class EksDeleteNodesParams {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  clusterId: number
}
export class EksDeleteNodesBody {
  @IsArray()
  @IsNotEmpty()
  hostIPs: string[]

  @IsNumber()
  @IsNotEmpty()
  nodeGroupId: number
}

export class EksAddNodesParams extends EksDeleteNodesParams {}

export class EksAddNodesBody extends EksDeleteNodesBody {}

export class EksGetNodeGroupListParams {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  clusterId: number
}

export class NodeGroupItem {
  nodeGroupId: number
  nodeGroupName: string
}

export class EksGetNodeGroupListResponse {
  nodeGroups: NodeGroupItem[]
}

export class EksSetNodesLabelsParams extends EksListNodesParams {}

export class EksLabel {
  @IsString()
  key: string

  @IsOptional()
  @IsString()
  value?: string
}

export class EksNodeLabel {
  @ValidateNested()
  @Type(() => EksLabel)
  labels: EksLabel

  @IsString()
  operator: string
}

export class EksSetNodesLabelsBody {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EksNodeLabel)
  labels: EksNodeLabel[]

  @IsArray()
  @IsString({ each: true })
  nodes: string[]
}

export class EksSetNodesTiantsParams extends EksListNodesParams {}

export class EksTiant {
  @IsString()
  effect: string

  @IsString()
  key: string

  @IsOptional()
  @IsString()
  value?: string
}

export class EksNodeTaint {
  @IsString()
  operator: string

  @ValidateNested()
  @Type(() => EksTiant)
  taints: EksTiant
}

export class EksSetNodesTiantsBody {
  @IsArray()
  @IsString({ each: true })
  nodes: string[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EksNodeTaint)
  taints: EksNodeTaint[]
}
