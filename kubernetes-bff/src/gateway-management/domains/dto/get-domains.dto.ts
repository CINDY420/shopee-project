import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ListQueryDto } from 'applications-management/projects/dto/create-project.dto'
import { IsNotEmpty, Validate } from 'class-validator'
import { IsClusterExit } from 'common/validator'

export class GetDomainParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsClusterExit)
  clusterName: string

  @ApiProperty()
  @IsNotEmpty()
  domainName: string

  @ApiProperty()
  searchBy: string
}

export class DomainRuleTarget {
  @ApiProperty()
  type: string

  @ApiProperty()
  service: string
}

export class DomainRule {
  @ApiProperty()
  path: string

  @ApiProperty()
  pathType: string

  @ApiProperty({ type: DomainRuleTarget })
  target: DomainRuleTarget
}

export class GetDomainResponseDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  env: string

  @ApiProperty()
  cid: string

  @ApiProperty()
  clusterName: string

  @ApiProperty()
  updater: string

  @ApiProperty()
  updateTime: string

  @ApiProperty({ type: [String] })
  pathTypeList: string[]

  @ApiProperty({ type: [DomainRule] })
  rules: DomainRule[]

  @ApiProperty()
  total: number
}

export class GetDomainQueryDto extends ListQueryDto {
  @ApiPropertyOptional()
  searchBy: string
}
