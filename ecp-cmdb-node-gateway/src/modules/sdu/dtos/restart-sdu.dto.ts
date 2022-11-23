import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class RestartSDUParam {
  @IsNotEmpty()
  @IsString()
  sduName: string
}

class DeployRestart {
  @IsNotEmpty()
  @IsString()
  deployId: string

  @IsNotEmpty()
  @IsString({ each: true })
  phases: string[]
}

export class RestartSDUBody {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeployRestart)
  deployRestarts: DeployRestart[]
}
