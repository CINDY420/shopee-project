import { ApiProperty } from '@nestjs/swagger'
import { IClusterStatus } from 'common/constants'

export class ClusterInfoHealthySummary {
  @ApiProperty()
  count: number

  @ApiProperty()
  unhealthyCount: number
}

export class ClusterInfoMetrics {
  @ApiProperty()
  capacity: number

  @ApiProperty()
  reserved: number

  @ApiProperty()
  assigned: number

  @ApiProperty()
  free: number

  @ApiProperty()
  used: number

  @ApiProperty()
  assignedUsage: number

  @ApiProperty()
  usedUsage: number
}

export class ClusterInfoAlarm {
  @ApiProperty()
  type: string

  @ApiProperty()
  resourceName: string

  @ApiProperty()
  detail: {
    [key: string]: string
  }
}

export class ClusterInfoConfig {
  @ApiProperty()
  name: string

  @ApiProperty()
  kubeconfig: string
}

export class Metrics {
  @ApiProperty({ type: ClusterInfoMetrics })
  cpu: ClusterInfoMetrics

  @ApiProperty({ type: ClusterInfoMetrics })
  memory: ClusterInfoMetrics
}

export class ClusterInfoDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  creationTimestamp: string

  @ApiProperty({ type: ClusterInfoConfig })
  config: ClusterInfoConfig

  @ApiProperty({ enum: ['Healthy', 'Unhealthy', 'Unknown'] })
  status: IClusterStatus

  @ApiProperty({ type: [ClusterInfoAlarm] })
  alarms: ClusterInfoAlarm[]

  @ApiProperty({ type: ClusterInfoHealthySummary })
  nodeSummary: ClusterInfoHealthySummary

  @ApiProperty({ type: ClusterInfoHealthySummary })
  podSummary: ClusterInfoHealthySummary

  @ApiProperty({ type: Metrics })
  metrics: Metrics

  @ApiProperty({ type: [String] })
  envs: string[]

  @ApiProperty({ type: [String] })
  cids: string[]

  @ApiProperty({ type: [String] })
  groups: string[]
}
