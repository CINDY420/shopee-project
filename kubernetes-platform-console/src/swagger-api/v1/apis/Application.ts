import fetch from 'helpers/fetchV1'
import * as types from '../models'

export interface IApplicationControllerListApplicationsParams {
  tenantId: string
  projectName: string
  offset?: string
  limit?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type ApplicationControllerListApplicationsFn = (
  params: IApplicationControllerListApplicationsParams
) => Promise<types.IListApplicationsResponse>

export const applicationControllerListApplications: ApplicationControllerListApplicationsFn = async ({
  tenantId,
  projectName,
  offset,
  limit,
  orderBy,
  filterBy,
  searchBy
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/applications`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, searchBy }
  })

  return body
}

export interface IApplicationControllerGetApplicationParams {
  tenantId: string
  projectName: string
  appName: string
}

type ApplicationControllerGetApplicationFn = (
  params: IApplicationControllerGetApplicationParams
) => Promise<types.IGetApplicationResponse>

export const applicationControllerGetApplication: ApplicationControllerGetApplicationFn = async ({
  tenantId,
  projectName,
  appName
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/applications/${appName}`,
    method: 'GET'
  })

  return body
}

export interface IApplicationControllerGetApplicationServiceNameParams {
  tenantId: string
  projectName: string
  appName: string
}

type ApplicationControllerGetApplicationServiceNameFn = (
  params: IApplicationControllerGetApplicationServiceNameParams
) => Promise<types.IGetApplicationServiceNameResponse>

export const applicationControllerGetApplicationServiceName: ApplicationControllerGetApplicationServiceNameFn = async ({
  tenantId,
  projectName,
  appName
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/applications/${appName}/serviceName`,
    method: 'GET'
  })

  return body
}
