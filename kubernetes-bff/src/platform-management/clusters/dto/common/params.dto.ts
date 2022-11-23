import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Validate } from 'class-validator'
import { IsClusterExit } from 'common/validator'

export class GetOrUpdateNameParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsClusterExit)
  clusterName: string
}

export class GetClusterStatusParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  clusters: string
}
