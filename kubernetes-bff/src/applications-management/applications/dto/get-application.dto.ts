import { ApiProperty } from '@nestjs/swagger'

class EnvPod {
  @ApiProperty()
  name: string

  @ApiProperty()
  abnormalPodCount: number

  @ApiProperty()
  normalPodCount: number
}

export class ApplicationGetResponseDto {
  @ApiProperty()
  cids: string[]

  @ApiProperty()
  clusters: string[]

  @ApiProperty()
  envs: string[]

  @ApiProperty()
  tenantName: string

  @ApiProperty()
  tenantId: number

  @ApiProperty()
  name: string

  @ApiProperty()
  projectName: string

  @ApiProperty()
  envPods: {
    [key: string]: EnvPod
  }

  @ApiProperty()
  projectEnvs: string[]
}
