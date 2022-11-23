import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Validate } from 'class-validator'
import { IsClusterExit } from 'common/validator'

export class GetOrUpdateDeployQueryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Validate(IsClusterExit)
  clusterName: string
}
