import { ApiProperty } from '@nestjs/swagger'

export class DomainGroupsDto {
  @ApiProperty()
  name: string

  @ApiProperty({ type: [String] })
  cid: string[]

  @ApiProperty({ type: [String] })
  env: string[]
}

export class GetDomainGroupsResponseDto {
  @ApiProperty()
  total: number

  @ApiProperty({ type: [DomainGroupsDto] })
  domainGroups: DomainGroupsDto[]
}
