import { IsArray, IsNotEmpty, IsNumberString, IsString } from 'class-validator'

export class CreateZoneParams {
  @IsNumberString()
  tenantId: string
}

export class CreateZoneBody {
  @IsString()
  @IsNotEmpty()
  namePrefix: string

  @IsArray()
  @IsNotEmpty()
  azs: string[]

  @IsString()
  @IsNotEmpty()
  description: string
}
