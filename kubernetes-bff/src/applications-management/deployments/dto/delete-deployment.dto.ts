import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteDeploymentParam {
  @IsNotEmpty()
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

export class DeleteDeploymentBody {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phase: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  cluster: string
}

export class DeleteDeploymentQuery extends DeleteDeploymentBody {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  env: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  cid: string
}
