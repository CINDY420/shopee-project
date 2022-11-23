import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { ListQueryDto as BaseListDto } from 'common/dtos/list.dto'
import { V1PodList } from '@kubernetes/client-node'
import { IEvent } from 'common/modules/event/event.service'

export class IGetPodListParams {
  @ApiProperty()
  tenantId: number

  @ApiProperty()
  projectName: string

  @ApiProperty()
  appName: string

  @ApiProperty()
  deployName: string
}

export class IGetPodListQuery extends BaseListDto {
  @ApiProperty()
  clusterId: string

  @ApiProperty()
  phase: string
}

export class IContainerResponse {
  @ApiProperty()
  image: string

  @ApiProperty()
  name: string

  @ApiProperty()
  tag: string
}

export class IPodUsage {
  @ApiProperty({ type: Number })
  used: number

  @ApiProperty({ type: Number })
  applied: number

  @ApiProperty({ type: Boolean })
  Ready?: boolean

  @ApiProperty({ type: String })
  alarm?: string

  @ApiProperty({ type: Number })
  total?: number
}

export class IPodBaseResponse {
  @ApiProperty()
  name: string

  @ApiProperty()
  nodeName: string

  @ApiProperty()
  projectName: string

  @ApiProperty()
  appName: string

  @ApiProperty()
  groupName: string

  @ApiProperty()
  clusterId: string

  @ApiProperty()
  namespace: string

  @ApiProperty()
  cid: string

  @ApiProperty()
  environment: string

  @ApiProperty()
  nodeIP: string

  @ApiProperty()
  podIP: string

  @ApiProperty()
  status: string

  @ApiProperty()
  creationTimestamp: string

  @ApiProperty({ type: [IContainerResponse] })
  containers: IContainerResponse[]

  @ApiProperty({ type: IPodUsage })
  cpu: IPodUsage

  @ApiProperty({ type: IPodUsage })
  memory: IPodUsage

  @ApiProperty()
  phase?: string

  @ApiProperty()
  traceId: string

  @ApiProperty({ type: Object })
  restart: {
    restartCount: number
    lastRestartTime: string
  }

  @ApiProperty()
  supportProfiling: boolean

  @ApiProperty()
  tenantId: number
}

export class IPodListResponse {
  @ApiProperty({ type: [IPodBaseResponse] })
  pods: IPodBaseResponse[]

  @ApiProperty({ type: Number })
  totalCount: number

  @ApiProperty({ type: [String] })
  statusList: string[]

  @ApiProperty({ type: [String] })
  phaseList: string[]
}

export class GetApplicationEventsResponseDto {
  @ApiProperty()
  totalCount: number

  @ApiProperty({ type: [IEvent] })
  events: IEvent[]

  @ApiProperty({ type: [String] })
  kindList: string[]
}

export class IDeletePodParams {
  @ApiProperty()
  @IsNotEmpty()
  tenantId: number

  @ApiProperty()
  @IsNotEmpty()
  projectName: string

  @ApiProperty()
  @IsNotEmpty()
  appName: string

  @ApiProperty()
  @IsNotEmpty()
  podName: string
}

export class IDeletePodQuery {
  @ApiProperty()
  @IsNotEmpty()
  clusterId: string
}

export class IBatchDeletePodParams {
  @ApiProperty()
  @IsNotEmpty()
  tenantId: number

  @ApiProperty()
  @IsNotEmpty()
  projectName: string

  @ApiProperty()
  @IsNotEmpty()
  appName: string
}

export class IPayloadPod {
  clusterId: string
  name: string
}

export class IBatchDeletePodsPayload {
  @ApiProperty({ type: [IPayloadPod] })
  @IsNotEmpty()
  pods: IPayloadPod[]
}

export interface IDeletePodResponse {
  result: string
}

export interface IApplicationInfo {
  group: string
  project: string
  app: string
}

export interface ILabelSelector {
  // group: string
  project: string
  application: string
}

export class IPodContainerFileLogParams extends IDeletePodParams {
  @ApiProperty()
  @IsNotEmpty()
  containerName: string

  @ApiProperty()
  @IsNotEmpty()
  fileName: string
}

export class IPodContainerFileLogQuery {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  clusterId: string

  @ApiProperty()
  searchBy: string
}

export interface IPodContainerFileLogResponse {
  content: string
}

export interface IGetK8sPods {
  phase: string
  projectName: string
  appName: string
  env: string
  cid: string
  fteName: string
  token: string
  clusterName: string
  agentPath: string
}

export interface IK8sPodsResponse {
  phaseSet: Record<string, string>
  podList: V1PodList
}

export interface IGetPodPreviousLogRequest {
  tenantId: number
  projectName: string
  appName: string
  podName: string
  namespace: string
}

export interface IGetPodPreviousLogResponse {
  code: number
  message: string
  log: string
}
