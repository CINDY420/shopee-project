import { ScaleDeploymentParam } from '@/modules/deployment/dtos/scale-deployment.dto'
import { IsNotEmpty, IsString } from 'class-validator'

export class RestartDeploymentParam extends ScaleDeploymentParam {}

export class RestartDeploymentBody {
  @IsNotEmpty()
  @IsString({ each: true })
  phases: string[]
}
