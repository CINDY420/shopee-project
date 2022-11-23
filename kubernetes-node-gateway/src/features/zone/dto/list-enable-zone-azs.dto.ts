import { AZ } from '@/features/global/entities/az.entity'
import { ListZoneParams } from '@/features/zone/dto/list-zone.dto'

export class ListEnableZoneAZsParams extends ListZoneParams {}

export class ListEnableZoneAZsResponse {
  azs: AZ[]
}
