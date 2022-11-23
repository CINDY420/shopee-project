import { IsNotEmpty, IsString } from 'class-validator'

export class GetEnabledSduAutoScalerParam {
  @IsNotEmpty()
  @IsString()
  sduName: string
}

export class GetEnabledSduAutoScalerQuery {
  @IsNotEmpty()
  @IsString()
  project: string

  @IsNotEmpty()
  @IsString()
  module: string
}

export class GetEnabledSduAutoScalerBody {
  enabledAutoScale: boolean
}
