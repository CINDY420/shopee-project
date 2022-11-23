import { DeployConfig } from '@/features/deploy-config/entities/deploy-config.entity'
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator'

export class GetDeployConfigParams {
  @IsNumberString()
  @IsNotEmpty()
  tenantId: string

  @IsString()
  @IsNotEmpty()
  appName: string

  @IsString()
  @IsNotEmpty()
  projectName: string
}

export class GetDeployConfigQuery {
  @IsString()
  @IsNotEmpty()
  env: string
}

export class GetDeployConfigResponse {
  enable: boolean
  comment: string
  createAt: string
  version: string
  deployConfig: DeployConfig
}
