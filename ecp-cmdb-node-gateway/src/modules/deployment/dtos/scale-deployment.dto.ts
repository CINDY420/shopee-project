import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class ScaleDeploymentParam {
  @IsString()
  @IsNotEmpty()
  sduName: string

  @IsString()
  @IsNotEmpty()
  deployId: string
}

export class ScaleDeploymentBody {
  @IsNumber()
  @IsNotEmpty()
  releaseReplicas: number

  @IsOptional()
  @IsNumber()
  canaryReplicas?: number

  @IsOptional()
  @IsBoolean()
  canaryValid?: boolean
}
