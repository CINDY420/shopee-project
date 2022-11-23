import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Validate } from 'class-validator'
import { IsApplicationExit } from 'common/validator/IsApplicationExit'

export class GetPodContainerResponseDto {
  @ApiProperty()
  pairs: any
}

export class GetPodContainerParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  tenantId: number

  @ApiProperty()
  @IsNotEmpty()
  projectName: string

  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsApplicationExit)
  appName: string

  @ApiProperty()
  @IsNotEmpty()
  podName: string

  @ApiProperty()
  @IsNotEmpty()
  containerName: string
}

export class GetPodContainerQueryDto {
  @ApiProperty()
  clusterId: string
}
