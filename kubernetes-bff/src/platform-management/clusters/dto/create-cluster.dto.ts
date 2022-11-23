import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength, Matches, Validate } from 'class-validator'
import { IsClusterNotExit } from 'common/validator'

export class CreateClusterDto {}
export class ClusterCreateBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  kubeconfig: string

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(128)
  @Matches(/^[a-zA-Z0-9_\-]+$/)
  @Validate(IsClusterNotExit)
  name: string
}
