import { IsNotEmpty, IsString } from 'class-validator'

export class StopSDUParam {
  @IsNotEmpty()
  @IsString()
  sduName: string
}

export class StopSDUBody {
  @IsNotEmpty()
  @IsString({ each: true })
  deployIds: string[]
}
