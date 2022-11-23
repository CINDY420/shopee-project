import { Zone } from '@/features/zone/entities/zone.entity'

export interface IOpenApiDeleteZoneBody {
  zoneName: string
}

export interface IOpenApiListZoneQuery {
  pageNum: number
  pageSize: number
}

export interface IOpenApiListZoneResponse {
  total: number
  lists: Zone[]
}
