import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class GetOrUpdateDeployParamsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  tenantId: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  projectName: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  appName: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  deployName: string
}
