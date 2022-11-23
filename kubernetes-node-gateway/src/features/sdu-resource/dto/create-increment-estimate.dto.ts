import { CreateIncrementEstimate } from '@/features/sdu-resource/entities/increment.entity'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'

export class CreateIncrementEstimateBody {
  @ValidateNested()
  @Type(() => CreateIncrementEstimate)
  data: CreateIncrementEstimate[]
}
