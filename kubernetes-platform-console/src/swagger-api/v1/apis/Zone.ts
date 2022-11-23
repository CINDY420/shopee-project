import fetch from 'helpers/fetchV1'
import * as types from '../models'

export interface IZoneControllerListZoneParams {
  tenantId: string
  offset?: string
  limit?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type ZoneControllerListZoneFn = (params: IZoneControllerListZoneParams) => Promise<types.IListZoneResponse>

export const zoneControllerListZone: ZoneControllerListZoneFn = async ({
  tenantId,
  offset,
  limit,
  orderBy,
  filterBy,
  searchBy
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/zones`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, searchBy }
  })

  return body
}

export interface IZoneControllerListAllZoneParams {
  tenantId: string
  az: string
}

type ZoneControllerListAllZoneFn = (params: IZoneControllerListAllZoneParams) => Promise<types.IListAllZoneResponse>

export const zoneControllerListAllZone: ZoneControllerListAllZoneFn = async ({ tenantId, az }) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/zones/all`,
    method: 'GET',
    params: { az }
  })

  return body
}

export interface IZoneControllerCreateZoneParams {
  tenantId: string
  payload: types.ICreateZoneBody
}

type ZoneControllerCreateZoneFn = (params: IZoneControllerCreateZoneParams) => Promise<any>

export const zoneControllerCreateZone: ZoneControllerCreateZoneFn = async ({ tenantId, payload }) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/zone`,
    method: 'POST',
    payload
  })

  return body
}

export interface IZoneControllerDeleteZoneParams {
  tenantId: string
  zoneName: string
}

type ZoneControllerDeleteZoneFn = (params: IZoneControllerDeleteZoneParams) => Promise<{}>

export const zoneControllerDeleteZone: ZoneControllerDeleteZoneFn = async ({ tenantId, zoneName }) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/zone/${zoneName}`,
    method: 'DELETE'
  })

  return body
}

export interface IZoneControllerListEnableZoneAZsParams {
  tenantId: string
}

type ZoneControllerListEnableZoneAZsFn = (
  params: IZoneControllerListEnableZoneAZsParams
) => Promise<types.IListEnableZoneAZsResponse>

export const zoneControllerListEnableZoneAZs: ZoneControllerListEnableZoneAZsFn = async ({ tenantId }) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/zone/:enableZoneAZs`,
    method: 'GET'
  })

  return body
}
