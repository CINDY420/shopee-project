import { ApiProperty } from '@nestjs/swagger'

export class IUsage {
  @ApiProperty({ type: Number })
  capacity: number

  @ApiProperty({ type: Number })
  used: number
}

export class INodeTaint {
  @ApiProperty()
  key: string

  @ApiProperty()
  value: string

  @ApiProperty()
  effect: string
}

export class INode {
  @ApiProperty()
  cluster: string

  @ApiProperty()
  name: string

  @ApiProperty()
  IP: string

  @ApiProperty({ type: [String] })
  roles: string[]

  @ApiProperty()
  status: string

  @ApiProperty({ type: [String] })
  statusExtra: string[]

  @ApiProperty({ type: IUsage })
  cpuMetrics: IUsage

  @ApiProperty({ type: IUsage })
  memMetrics: IUsage

  @ApiProperty({ type: IUsage })
  podMetrics: IUsage

  @ApiProperty({ type: INodeTaint })
  taints: INodeTaint[]

  @ApiProperty({ type: Object })
  labels: {
    [key: string]: string
  }
}
