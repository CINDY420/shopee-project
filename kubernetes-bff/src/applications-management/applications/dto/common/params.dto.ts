import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class ApplicationsParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  tenantId: number

  @ApiProperty()
  @IsNotEmpty()
  projectName: string
}

export class ApplicationParamsDto extends ApplicationsParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  appName: string
}
