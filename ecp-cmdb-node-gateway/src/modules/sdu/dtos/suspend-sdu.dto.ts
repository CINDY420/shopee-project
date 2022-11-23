import { IsNotEmpty, IsString } from 'class-validator'

export class SuspendSDUParam {
  @IsNotEmpty()
  @IsString()
  sduName: string
}

export class SuspendSDUBody {
  @IsNotEmpty()
  @IsString({ each: true })
  deployIds: string[]
}
