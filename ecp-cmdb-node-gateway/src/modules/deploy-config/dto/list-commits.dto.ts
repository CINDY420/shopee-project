import { Commit } from '@/modules/deploy-config/entities/deploy-config.entity'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class ListCommitsQuery {
  @IsOptional()
  @IsString()
  project?: string

  @IsOptional()
  @IsString()
  serviceId?: string

  @IsNotEmpty()
  @IsString()
  env: string

  @IsOptional()
  @IsString()
  commitId?: string

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number
}

export class ListCommitsResponse {
  commits: Commit[]
  total: number
}
