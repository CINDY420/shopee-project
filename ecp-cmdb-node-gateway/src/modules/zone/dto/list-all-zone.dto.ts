import { Zone } from '@/modules/zone/entities/zone.entity'
import { IsNotEmpty, IsString } from 'class-validator'

export class ListAllZoneParams {
  @IsNotEmpty()
  @IsString()
  serviceName: string
}

export class ListAllZoneResponse {
  zones: Zone[]
}
