import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Validate } from 'class-validator'
import { IsApplicationExit } from 'common/validator/IsApplicationExit'

class Graph {
  @ApiProperty()
  x: number

  @ApiProperty()
  y: number
}

class Metric {
  @ApiProperty()
  Ready: boolean

  @ApiProperty()
  capacity: number

  @ApiProperty({ type: [Graph] })
  graph: Graph[]

  @ApiProperty()
  status: string

  @ApiProperty()
  used: number
}

class Volume {
  @ApiProperty()
  mountPoint: string

  @ApiProperty()
  name: string

  @ApiProperty()
  readonly: string

  @ApiProperty()
  source: string

  @ApiProperty()
  type: string
}

export class GetPodDetailResponseDto {
  @ApiProperty()
  appName: string

  @ApiProperty()
  cid: string

  @ApiProperty()
  clusterId: string

  @ApiProperty()
  clusterName: string

  @ApiProperty({ type: [String] })
  containers: string[]

  @ApiProperty({ type: Metric })
  cpu: Metric

  @ApiProperty()
  creationTimestamp: string

  @ApiProperty()
  environment: string

  @ApiProperty({ type: Metric })
  filesystem: Metric

  @ApiProperty()
  groupName: string

  @ApiProperty()
  labels: string[]

  @ApiProperty({ type: Metric })
  memRss: Metric

  @ApiProperty({ type: Metric })
  memory: Metric

  @ApiProperty()
  name: string

  @ApiProperty()
  nodeIP: string

  @ApiProperty()
  nodeName: string

  @ApiProperty()
  phase: string

  @ApiProperty()
  traceId: string

  @ApiProperty()
  podIP: string

  @ApiProperty()
  podPort: string

  @ApiProperty()
  projectName: string

  @ApiProperty()
  status: string

  @ApiProperty()
  tag: string

  @ApiProperty({ type: [Volume] })
  volumes: Volume[]

  @ApiProperty()
  namespace: string

  @ApiProperty()
  tenantId: number

  @ApiProperty()
  zoneName: string
}

export class GetPodDetailParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  tenantId: number

  @ApiProperty()
  @IsNotEmpty()
  projectName: string

  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsApplicationExit)
  appName: string

  @ApiProperty()
  @IsNotEmpty()
  podName: string
}

export class GetPodDetailQueryDto {
  @ApiProperty()
  @IsNotEmpty()
  clusterId: string
}
