import { IsNotEmpty, IsString } from 'class-validator'

export class UnbindSDUParam {
  @IsNotEmpty()
  @IsString()
  serviceName: string

  @IsNotEmpty()
  @IsString()
  sduName: string
}
