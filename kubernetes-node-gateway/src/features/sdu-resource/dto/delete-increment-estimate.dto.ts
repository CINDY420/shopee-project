import { IsArray, IsNotEmpty } from 'class-validator'

export class DeleteIncrementEstimateBody {
  @IsNotEmpty()
  @IsArray()
  ids: string[]
}
