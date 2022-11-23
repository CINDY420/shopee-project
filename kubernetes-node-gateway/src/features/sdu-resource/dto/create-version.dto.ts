import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateVersionBody {
  @IsNotEmpty()
  @IsString()
  endBigSaleId: string

  @IsNotEmpty()
  @IsString()
  startBigSaleId: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  state: number
}
