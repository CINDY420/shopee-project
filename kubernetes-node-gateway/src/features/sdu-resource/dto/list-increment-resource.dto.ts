import { FrontEndIncrement } from '@/features/sdu-resource/entities/increment.entity'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
export class ListIncrementQuery {
  @IsString()
  @IsOptional()
  level1?: string

  @IsString()
  @IsOptional()
  level2?: string

  @IsString()
  @IsOptional()
  level3?: string

  @IsOptional()
  @IsString()
  env?: string

  @IsOptional()
  @IsString()
  cid?: string

  @IsOptional()
  @IsString()
  az?: string

  @IsOptional()
  @IsString()
  versionId?: string

  @IsOptional()
  @IsString()
  cluster?: string

  @IsOptional()
  @IsString()
  segment?: string

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  limit: number

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  offset: number
}

export class ListIncrementResponse {
  data: FrontEndIncrement[]
  total: number
}
