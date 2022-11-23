import fetch from 'helpers/fetchV1'
import * as types from '../models'

export interface ISduControllerListSdusParams {
  tenantId: string
  projectName: string
  appName: string
  offset?: string
  limit?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type SduControllerListSdusFn = (params: ISduControllerListSdusParams) => Promise<types.IListSdusResponse>

export const sduControllerListSdus: SduControllerListSdusFn = async ({
  tenantId,
  projectName,
  appName,
  offset,
  limit,
  orderBy,
  filterBy,
  searchBy
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/applications/${appName}/sdus`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, searchBy }
  })

  return body
}

export interface ISduControllerListAllAzSdusParams {
  tenantId: string
  projectName: string
  appName: string
}

type SduControllerListAllAzSdusFn = (params: ISduControllerListAllAzSdusParams) => Promise<types.IListAllAzSdusResponse>

export const sduControllerListAllAzSdus: SduControllerListAllAzSdusFn = async ({ tenantId, projectName, appName }) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/applications/${appName}/allAzSdus`,
    method: 'GET'
  })

  return body
}

export interface ISduControllerGetSduAzsParams {
  tenantId: string
  projectName: string
  appName: string
  sduName: string
}

type SduControllerGetSduAzsFn = (params: ISduControllerGetSduAzsParams) => Promise<types.IGetSduAzsResponse>

export const sduControllerGetSduAzs: SduControllerGetSduAzsFn = async ({ tenantId, projectName, appName, sduName }) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/applications/${appName}/sdus/${sduName}`,
    method: 'GET'
  })

  return body
}
