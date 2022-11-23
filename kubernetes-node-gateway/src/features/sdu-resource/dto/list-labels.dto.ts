import { Label } from '@/features/sdu-resource/entities/label.entity'
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator'

export class ListLabelsQuery {
  @IsNumberString()
  @IsNotEmpty()
  depth: number
}

export class ListSecondLabelsParams {
  @IsString()
  @IsNotEmpty()
  firstLabelId: string
}

export class ListThirdLabelsParams extends ListSecondLabelsParams {
  @IsString()
  @IsNotEmpty()
  secondLabelId: string
}

export class ListLabelsResponse {
  labels: Label[]
  total: number
}
