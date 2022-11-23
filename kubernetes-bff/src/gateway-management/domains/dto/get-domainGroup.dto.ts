import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Validate } from 'class-validator'
import { IsClusterExit } from 'common/validator'
import { DomainGroupsDto } from './get-domainGroups.dto'

export class GetDomainGroupParamsDto {
  @ApiProperty()
  domainGroupName: string
}

export class DomainDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  cid: string

  @ApiProperty()
  env: string

  @ApiProperty()
  updater: string

  @ApiProperty()
  updateTime: string
}

export class GetDomainGroupResponseDto extends DomainGroupsDto {
  @ApiProperty({ type: [String] })
  cluster: string[]

  @ApiProperty({ type: [DomainDto] })
  domain: DomainDto[]

  @ApiProperty()
  total: number
}
