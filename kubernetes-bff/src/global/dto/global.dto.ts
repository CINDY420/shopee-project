import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class IMetadataResponse {
  @ApiProperty()
  roles: string[]

  @ApiProperty()
  statuses: string[]
}

export class IGlobalDataResponse {
  @ApiProperty()
  items: string[]

  @ApiProperty()
  count: number
}

export class IGetResourceParams {
  @ApiProperty()
  @IsNotEmpty()
  searchBy: string
}

export class IGlobalPod {
  @ApiProperty()
  appName: string

  @ApiProperty()
  groupName: string

  @ApiProperty()
  projectName: string

  @ApiProperty()
  deployName: string

  @ApiProperty()
  podName: string

  @ApiProperty()
  podIP: string

  @ApiProperty()
  clusterId: string

  @ApiProperty()
  kind: string

  @ApiProperty()
  tenantId: number
}

export class IGlobalApplication {
  @ApiProperty()
  appName: string

  @ApiProperty()
  groupName: string

  @ApiProperty()
  projectName: string

  @ApiProperty()
  kind: string

  @ApiProperty()
  tenantName: string

  @ApiProperty()
  tenantId: number
}

export class IResourceResponse {
  @ApiProperty({ type: [IGlobalPod] })
  pods: IGlobalPod[]

  @ApiProperty({ type: [IGlobalApplication] })
  applications: IGlobalApplication[]
}
