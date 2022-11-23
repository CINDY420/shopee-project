import { AZ } from '@/features/global/entities/az.entity'
import { IsOptional, IsString } from 'class-validator'

export class ListAZsQuery {
  @IsOptional()
  @IsString()
  env?: string
}

export class ListAZsResponse {
  azs: AZ[]
  total: number
}
