import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class ScaleSDUParam {
  @IsString()
  @IsNotEmpty()
  sduName: string
}

export class DeployInstances {
  @IsNotEmpty()
  @IsNumber()
  releaseReplicas: number

  @IsOptional()
  @IsNumber()
  canaryReplicas?: number

  @IsOptional()
  canaryValid?: boolean
}

export class DeployMeta {
  @IsString()
  @IsNotEmpty()
  az: string

  @IsString()
  @IsNotEmpty()
  componentType: string
}

export class DeploymentInstances {
  instances: DeployInstances
  meta: DeployMeta
}

export class ScaleSDUBody {
  @IsNotEmpty()
  deployments: {
    [key: string]: DeploymentInstances
  }
}
