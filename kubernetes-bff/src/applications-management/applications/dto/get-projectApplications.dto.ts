import { ApiProperty } from '@nestjs/swagger'

class ProjectApplication {
  @ApiProperty({ type: [String] })
  cids: string[]

  @ApiProperty({ type: [String] })
  environments: string[]

  @ApiProperty()
  name: string

  @ApiProperty()
  status: string

  // unused property
  // @ApiProperty()
  // clusterId: string

  // @ApiProperty()
  // desiredPodCount: number

  // @ApiProperty()
  // groupName: string

  // @ApiProperty()
  // healthyPodCount: number

  // @ApiProperty()
  // projectName: string
}

export class ProjectApplicationsResponseDto {
  @ApiProperty({ type: [ProjectApplication] })
  apps: ProjectApplication[]

  @ApiProperty()
  tenantName: string

  @ApiProperty()
  tenantId: number

  @ApiProperty()
  projectName: string

  @ApiProperty()
  totalCount: number
}
