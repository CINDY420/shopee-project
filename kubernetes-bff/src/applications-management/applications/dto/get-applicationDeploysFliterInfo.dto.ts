import { ApiProperty } from '@nestjs/swagger'

export class ApplicationDeploysFilterInfo {
  @ApiProperty()
  cids: string[]

  @ApiProperty()
  clusters: string[]

  @ApiProperty()
  envs: string[]

  @ApiProperty()
  name: string
}
