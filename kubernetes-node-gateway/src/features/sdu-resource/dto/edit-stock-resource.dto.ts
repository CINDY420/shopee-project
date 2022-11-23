import { EditStockResource } from '@/features/sdu-resource/entities/stock.entity'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsOptional, ValidateNested } from 'class-validator'

export class EditStockResourceBody {
  @IsArray()
  sduClusterIds: string[]

  @IsOptional()
  @IsBoolean()
  isBatch?: boolean

  @ValidateNested()
  @Type(() => EditStockResource)
  data: EditStockResource
}
