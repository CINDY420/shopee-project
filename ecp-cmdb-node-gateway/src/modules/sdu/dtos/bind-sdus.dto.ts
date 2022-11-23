import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class BindSDUsParam {
  @IsNotEmpty()
  @IsString()
  serviceName: string
}

export class BindSDUsBody {
  @IsNotEmpty()
  @IsString({ each: true })
  sdus: string[]

  @IsOptional()
  @IsBoolean()
  force?: boolean
}
