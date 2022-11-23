import { IsNotEmpty, IsNumberString } from 'class-validator'
import { ListQuery } from '@/common/models/dtos/list-query.dto'
import { Zone } from '@/features/zone/entities/zone.entity'

export class ListZoneParams {
  @IsNotEmpty()
  @IsNumberString()
  tenantId: string
}

export class ListZoneQuery extends ListQuery {}

export class ListZoneResponse {
  zones: Zone[]
  total: number
}
