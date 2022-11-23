import fetch from 'helpers/fetch'
import * as types from '../models'

export interface IDirectoryControllerGroupDirectoryGetApplicationsParams {
  tenantId: string
  projectName: string
  searchBy?: string
}

type DirectoryControllerGroupDirectoryGetApplicationsFn = (
  params: IDirectoryControllerGroupDirectoryGetApplicationsParams
) => Promise<types.IISearchTenantApplicationsResponse>

export const directoryControllerGroupDirectoryGetApplications: DirectoryControllerGroupDirectoryGetApplicationsFn = async ({
  tenantId,
  projectName,
  searchBy
}) => {
  const body = await fetch({
    resource: `v3/directory/tenants/${tenantId}/projects/${projectName}/applications`,
    method: 'GET',
    params: { searchBy }
  })

  return body
}

export interface IDirectoryControllerGroupDirectoryGetProjectsParams {
  tenantId: number
  searchBy?: string
}

type DirectoryControllerGroupDirectoryGetProjectsFn = (
  params: IDirectoryControllerGroupDirectoryGetProjectsParams
) => Promise<types.IIGroupDirectoryGetProjectsResponse>

export const directoryControllerGroupDirectoryGetProjects: DirectoryControllerGroupDirectoryGetProjectsFn = async ({
  tenantId,
  searchBy
}) => {
  const body = await fetch({
    resource: `v3/directory/tenants/${tenantId}/projects`,
    method: 'GET',
    params: { searchBy }
  })

  return body
}

export interface IDirectoryControllerGroupDirectoryGetGroupsParams {
  searchBy?: string
}

type DirectoryControllerGroupDirectoryGetGroupsFn = (
  params: IDirectoryControllerGroupDirectoryGetGroupsParams
) => Promise<types.IITenantDirectoryGetTenantsResponse>

export const directoryControllerGroupDirectoryGetGroups: DirectoryControllerGroupDirectoryGetGroupsFn = async ({
  searchBy
}) => {
  const body = await fetch({
    resource: 'v3/directory/tenants',
    method: 'GET',
    params: { searchBy }
  })

  return body
}

export interface IDirectoryControllerGroupDirectoryGetDomainGroupsParams {
  searchBy: string
}

type DirectoryControllerGroupDirectoryGetDomainGroupsFn = (
  params: IDirectoryControllerGroupDirectoryGetDomainGroupsParams
) => Promise<types.IIGroupDirectoryGetDomainGroups>

export const directoryControllerGroupDirectoryGetDomainGroups: DirectoryControllerGroupDirectoryGetDomainGroupsFn = async ({
  searchBy
}) => {
  const body = await fetch({
    resource: 'v3/directory/domainGroups',
    method: 'GET',
    params: { searchBy }
  })

  return body
}
