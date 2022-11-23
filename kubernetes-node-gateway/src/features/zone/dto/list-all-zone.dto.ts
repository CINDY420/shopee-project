import { IsNotEmpty, IsNumberString, IsString } from 'class-validator'
import { Zone } from '@/features/zone/entities/zone.entity'

export class ListAllZoneParams {
  @IsNotEmpty()
  @IsNumberString()
  tenantId: string
}

export class ListAllZoneQuery {
  @IsNotEmpty()
  @IsString()
  az: string
}

export class ListAllZoneResponse {
  zones: Zone[]
}
