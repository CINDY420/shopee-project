import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export enum STRATEGY_TYPE {
  RollingUpdate = 'RollingUpdate',
  Recreate = 'Recreate'
}

export class Templateoverwrite {
  @ApiProperty()
  @IsNotEmpty()
  cid: string

  @ApiProperty({ type: [String] })
  clusters: string[]

  @ApiProperty()
  @IsNotEmpty()
  type: string
}

export class TemplateConfig {
  @ApiProperty()
  @IsNotEmpty()
  type: string

  @ApiProperty({ type: [Templateoverwrite] })
  templateOverwriteList: Templateoverwrite[]
}

export class RollingUpdate {
  @ApiProperty()
  @IsNotEmpty()
  maxUnavailable: string

  @ApiProperty()
  @IsNotEmpty()
  maxSurge: string
}

export class StrategyOverwrite {
  @ApiProperty()
  @IsNotEmpty()
  cid: string

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  clusters: string[]

  @ApiProperty()
  @IsNotEmpty()
  type: string

  @ApiPropertyOptional({ type: RollingUpdate })
  rollingUpdate?: RollingUpdate
}

export class StrategyConfig {
  @ApiProperty()
  @IsNotEmpty()
  type: string

  @ApiPropertyOptional({ type: RollingUpdate })
  rollingUpdate: RollingUpdate

  @ApiProperty({ type: [StrategyOverwrite] })
  strategyOverwrite: StrategyOverwrite[]
}

export class Instance {
  @ApiProperty()
  @IsNotEmpty()
  cluster: string

  @ApiProperty()
  @IsNotEmpty()
  podCount: number

  @ApiProperty()
  @IsNotEmpty()
  enableCanary: boolean

  @ApiProperty()
  canaryInitCount: number
}
export class DeployDetail {
  @ApiProperty()
  @IsNotEmpty()
  cid: string

  @ApiProperty({ type: [Instance] })
  instances: Instance[]
}

export class CidAzs {
  @ApiProperty({ type: [String] })
  cids: string[]

  @ApiProperty({ type: [String] })
  azs: string[]
}

export class DeployAz {
  @ApiProperty({ type: [CidAzs] })
  cidAzs: CidAzs[]

  @ApiProperty({ type: [DeployDetail] })
  deployDetailList: DeployDetail[]
}

export class ResourceDesc {
  @ApiProperty()
  @IsNotEmpty()
  cpu: number

  @ApiProperty()
  gpu: number

  @ApiProperty()
  @IsNotEmpty()
  memory: number
}

export class Resource {
  @ApiProperty({ type: [String] })
  cids: string[]

  @ApiProperty()
  resourceDesc: ResourceDesc
}

export class Resources {
  @ApiProperty({ type: ResourceDesc })
  resource: ResourceDesc

  @ApiProperty({ type: [Resource] })
  cidResourceList: Resource[]
}

export class DeployConfigParam {
  @ApiProperty()
  @IsNotEmpty()
  tenantId: number

  @ApiProperty()
  @IsNotEmpty()
  appName: string

  @ApiProperty()
  @IsNotEmpty()
  projectName: string
}

export class GetDeployConfigRequestQuery {
  @ApiProperty()
  @IsNotEmpty()
  env: string
}

export class DeployConfig {
  @ApiProperty()
  enable: boolean

  @ApiProperty()
  syncWithLeap: boolean

  @ApiProperty({ type: TemplateConfig })
  template: TemplateConfig

  @ApiProperty({ type: StrategyConfig })
  strategy: StrategyConfig

  @ApiProperty({ type: DeployAz })
  deployAz: DeployAz

  @ApiProperty({ type: Resources })
  resources: Resources

  @ApiProperty()
  version: number
}

export class GetDeployConfigResponse {
  @ApiProperty()
  code: string

  @ApiProperty()
  message: string

  @ApiProperty({ type: DeployConfig })
  data: DeployConfig
}

export class UpdateDeployConfigRequestBody {
  @ApiProperty()
  @IsNotEmpty()
  env: string

  @ApiProperty({ type: TemplateConfig })
  template: TemplateConfig

  @ApiProperty({ type: StrategyConfig })
  strategy: StrategyConfig

  @ApiProperty({ type: DeployAz })
  deployAz: DeployAz

  @ApiProperty({ type: Resources })
  resources: Resources

  @ApiProperty()
  version: number
}

export class UpdateDeployConfigResponse<T> {
  code: number
  message: string
  data: T
}
