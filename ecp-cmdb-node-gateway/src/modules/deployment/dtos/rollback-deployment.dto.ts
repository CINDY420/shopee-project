import { ScaleDeploymentParam } from '@/modules/deployment/dtos/scale-deployment.dto'
import { IsNotEmpty, IsString, IsArray } from 'class-validator'
import { Container } from '@/modules/sdu/dtos/list-sdu.dto'

export class RollbackDeploymentParam extends ScaleDeploymentParam {}

export class RollbackDeploymentBody {
  @IsNotEmpty()
  @IsString()
  deploymentId: string

  @IsNotEmpty()
  @IsArray()
  containers: Container[]
}
