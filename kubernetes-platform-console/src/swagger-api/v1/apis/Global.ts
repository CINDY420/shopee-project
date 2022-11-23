import fetch from 'helpers/fetchV1'
import * as types from '../models'

export interface IGlobalControllerListAZsParams {
  env?: string
}

type GlobalControllerListAZsFn = (params: IGlobalControllerListAZsParams) => Promise<types.IListAZsResponse>

export const globalControllerListAZs: GlobalControllerListAZsFn = async ({ env }) => {
  const body = await fetch({
    resource: 'v1/global/azs',
    method: 'GET',
    params: { env }
  })

  return body
}

export interface IGlobalControllerListAnnouncementsParams {
  tenant: number
}

type GlobalControllerListAnnouncementsFn = (
  params: IGlobalControllerListAnnouncementsParams
) => Promise<types.IListAnnouncementsResponse>

export const globalControllerListAnnouncements: GlobalControllerListAnnouncementsFn = async ({ tenant }) => {
  const body = await fetch({
    resource: 'v1/global/announcements',
    method: 'GET',
    params: { tenant }
  })

  return body
}

type GlobalControllerListOfflineTenantsFn = () => Promise<types.IListOfflineTenantsResponse>

export const globalControllerListOfflineTenants: GlobalControllerListOfflineTenantsFn = async () => {
  const body = await fetch({
    resource: 'v1/global/offlineTenants',
    method: 'GET'
  })

  return body
}
