import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsStringOrNull } from 'common/decorators/validations/common'
import { ListQueryDto } from 'common/dtos/index'
import { IEvent } from 'common/modules/event/event.service'

export class ApplicationDeploysQueryDto extends ListQueryDto {
  @ApiPropertyOptional()
  @IsStringOrNull()
  cid: string

  @ApiPropertyOptional()
  @IsStringOrNull()
  env: string

  @ApiPropertyOptional()
  @IsStringOrNull()
  cluster: string
}

export class ContainerInfo {
  @ApiProperty()
  image: string

  @ApiProperty()
  name: string

  @ApiProperty()
  tag: string
}

export interface IContainerDetailInfo {
  cpuLimit?: any
  cpuRequest?: any
  healthCheck?: any
  image?: string
  lifeCycle?: any
  memLimit?: any
  memRequest?: any
  name?: string
}

export class DeployInfo {
  @ApiPropertyOptional()
  name: string

  @ApiPropertyOptional()
  podCount: number

  @ApiPropertyOptional()
  releaseCount: number

  @ApiPropertyOptional()
  canaryCount: number

  @ApiPropertyOptional()
  status: string

  @ApiPropertyOptional({ type: [ContainerInfo] })
  containers: ContainerInfo[]

  @ApiPropertyOptional()
  phase: string

  @ApiPropertyOptional()
  updateTime: string

  @ApiPropertyOptional()
  clusterId: string

  @ApiPropertyOptional()
  scalable: boolean

  @ApiPropertyOptional()
  rollbackable: boolean

  @ApiPropertyOptional()
  fullreleaseable: boolean

  @ApiPropertyOptional()
  restartable: boolean

  @ApiPropertyOptional()
  appInstanceName: string

  @ApiPropertyOptional()
  clusterName: string

  @ApiPropertyOptional()
  monitoringClusterName: string

  @ApiPropertyOptional()
  abnormalPodCount: number

  @ApiPropertyOptional()
  runningPodCount: number

  @ApiPropertyOptional()
  deployName: string
}

export class DeployInfo2 {
  abnormalPodCount?: number
  appliedCPU?: any
  appliedMemory?: any
  buildId?: string
  canaryCount?: number
  cid?: string
  clusterId?: string
  clusterName?: string
  containers?: ContainerInfo[]
  containersDetail?: IContainerDetailInfo[]
  deployName?: string
  deployTime?: string
  editresourceable?: boolean
  env?: string
  envs?: string
  fullreleaseable?: boolean
  imageName?: string
  killable?: boolean
  lifeCycle?: string
  livenessProbe?: string
  name?: string
  phase?: string
  phaseList?: string[]
  pipelineName?: string
  podCount?: number
  readinessProbe?: string
  releaseCount?: number
  requestCPU?: any
  requestMemory?: any
  restartable?: boolean
  rollbackable?: boolean
  rollingUpdateStrategy?: any
  runningPodCount?: number
  scalable?: boolean
  status?: string
  strategy?: string
  tag?: string
  updateTime?: string
  volumes?: string
}

export class ApplicationDeploysResponseDto {
  @ApiProperty()
  groupName: string

  @ApiProperty()
  projectName: string

  @ApiProperty()
  appName: string

  @ApiProperty()
  totalCount: number

  @ApiProperty({ type: [DeployInfo] })
  deploys: DeployInfo[]

  @ApiProperty()
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
