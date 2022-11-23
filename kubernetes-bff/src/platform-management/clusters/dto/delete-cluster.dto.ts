import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Validate } from 'class-validator'
import { IsClusterExit } from 'common/validator'

export class ClusterDeleteResponseDto {}

export class ClusterDeleteParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsClusterExit)
  clusterName: string
}
