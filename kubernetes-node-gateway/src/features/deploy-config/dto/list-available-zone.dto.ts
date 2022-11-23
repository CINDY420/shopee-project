import { AvailableZone } from '@/features/deploy-config/entities/available-zones.entity'

export class ListAvailableZonesResponse {
  availableZones: AvailableZone[]
  total: number
}
