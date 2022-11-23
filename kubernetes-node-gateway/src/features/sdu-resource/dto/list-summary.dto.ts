import { SummaryData } from '@/features/sdu-resource/entities/summary.entity'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class ListSummaryQuery {
  @IsString()
  @IsNotEmpty()
  groupBy: string

  @IsOptional()
  @IsString()
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
  env?: string

  @IsOptional()
  @IsString()
  machineModel?: string

  @IsOptional()
  @IsString()
  versionId?: string

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number
}

export class ListSummaryResponse {
  summaries: SummaryData[]
  total: number
}
