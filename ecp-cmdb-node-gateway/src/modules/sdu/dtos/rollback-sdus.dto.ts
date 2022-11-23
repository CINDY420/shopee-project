import { Type } from 'class-transformer'
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'

export class DeploymentRollbackHistory {
  @IsNotEmpty()
  @IsString()
  deploymentId: string

  @IsNotEmpty()
  @IsString()
  targetDeploymentId: string
}

class RollbackSDUData {
  @IsNotEmpty()
  @IsString()
  sdu: string

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DeploymentRollbackHistory)
  deployments: DeploymentRollbackHistory[]
}

export class RollbackSDUsBody {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RollbackSDUData)
  rollbackSDUsData: RollbackSDUData[]
}
