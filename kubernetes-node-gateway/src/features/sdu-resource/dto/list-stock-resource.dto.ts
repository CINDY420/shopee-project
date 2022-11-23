import { FrontEndStock } from '@/features/sdu-resource/entities/stock.entity'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
export class ListStockQuery {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  limit: number

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  offset: number

  @IsString()
  @IsOptional()
  level1?: string

  @IsOptional()
  @IsString()
  level2?: string

  @IsOptional()
  @IsString()
  level3?: string

  @IsOptional()
  @IsString()
  az?: string

  @IsOptional()
  @IsString()
  cluster?: string

  @IsOptional()
  @IsString()
  segment?: string

  @IsOptional()
  @IsString()
  env?: string

  @IsOptional()
  @IsString()
  cid?: string

  @IsOptional()
  @IsString()
  versionId?: string

  @IsOptional()
  @IsString()
  filterBy?: string

  @IsOptional()
  @IsString()
  grepKey?: string
}

export class ListOpenApiStockQuery {
  @IsNumber()
  @IsNotEmpty()
  limit: number

  @IsNumber()
  @IsNotEmpty()
  offset: number

  @IsString()
  @IsOptional()
  level1?: string

  @IsOptional()
  @IsString()
  level2?: string

  @IsOptional()
  @IsString()
  level3?: string

  @IsOptional()
  @IsString()
  az?: string

  @IsOptional()
  @IsString()
  cluster?: string

  @IsOptional()
  @IsString()
  segment?: string

  @IsOptional()
  @IsString()
  env?: string

  @IsOptional()
  @IsString()
  cid?: string

  @IsOptional()
  @IsString()
  versionId?: string

  @IsOptional()
  @IsNumber()
  editStatus?: number

  @IsOptional()
  @IsString()
  grepKey?: string
}

export class ListStockResponse {
  data: FrontEndStock[]
  total: number
}
