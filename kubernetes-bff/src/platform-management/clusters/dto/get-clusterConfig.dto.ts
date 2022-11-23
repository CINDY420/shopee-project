import { ApiProperty } from '@nestjs/swagger'
import { Validate } from 'class-validator'
import { IsValidClusterConfigItem } from 'common/validator'
export class ClusterConfigDto {
  @ApiProperty({ type: [String] })
  @Validate(IsValidClusterConfigItem)
  cids: string[]

  @ApiProperty({ type: [String] })
  @Validate(IsValidClusterConfigItem)
  environments: string[]

  @ApiProperty({ type: [String] })
  // @Validate(IsValidClusterConfigItem)
  tenants?: string[]
}

export enum ClusterConfigKeys {
  cids = 'cids',
  groups = 'groups',
  environments = 'envs',
  envs = 'environments'
}
