import { AvailableZone } from '@/modules/deploy-config/entities/available-zones.entity'
import { IsNotEmpty, IsString } from 'class-validator'

export class ListAvailableZonesQuery {
  @IsNotEmpty()
  @IsString()
  env: string
}

export class ListAvailableZonesResponse {
  availableZones: AvailableZone[]
  total: number
}
