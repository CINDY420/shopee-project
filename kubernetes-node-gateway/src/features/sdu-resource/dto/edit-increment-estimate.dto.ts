import { EditIncrementEstimate } from '@/features/sdu-resource/entities/increment.entity'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsOptional, ValidateNested } from 'class-validator'

export class EditIncrementEstimateBody {
  @IsArray()
  ids: string[]

  @IsOptional()
  @IsBoolean()
  isBatch?: boolean

  @ValidateNested()
  @Type(() => EditIncrementEstimate)
  data: EditIncrementEstimate
}
