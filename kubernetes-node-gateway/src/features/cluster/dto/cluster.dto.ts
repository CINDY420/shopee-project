import { IsNotEmpty, IsString } from 'class-validator'
export class GetGlobalHpaParams {
  @IsNotEmpty()
  @IsString()
  cluster: string
}

export class GetGlobalHpaResponse {
  @IsNotEmpty()
  hpaStatus: boolean
}

export class UpdateGlobalHpaParams {
  @IsNotEmpty()
  @IsString()
  cluster: string
}

export class UpdateGlobalHpaBody {
  @IsNotEmpty()
  hpaStatus: boolean
}
