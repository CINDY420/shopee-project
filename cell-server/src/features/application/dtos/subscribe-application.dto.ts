import { Type } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator'

export class SubscribeApplicationParam {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  appId: number
}

export class SubscribeApplicationBody {
  @IsBoolean()
  subscribed: boolean
}
