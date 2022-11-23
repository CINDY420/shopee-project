import fetch from 'helpers/fetchV1'
import * as types from '../models'

export interface IDirectoryControllerListDirectoryProjectsParams {
  tenantId: string
  searchBy?: string
}

type DirectoryControllerListDirectoryProjectsFn = (
  params: IDirectoryControllerListDirectoryProjectsParams
) => Promise<types.IListDirectoryProjectsResponse>

export const directoryControllerListDirectoryProjects: DirectoryControllerListDirectoryProjectsFn = async ({
  tenantId,
  searchBy
}) => {
  const body = await fetch({
    resource: `v1/directory/tenants/${tenantId}/projects`,
    method: 'GET',
    params: { searchBy }
  })

  return body
}

export interface IDirectoryControllerListDirectoryApplicationsParams {
  tenantId: string
  projectName: string
  searchBy?: string
}

type DirectoryControllerListDirectoryApplicationsFn = (
  params: IDirectoryControllerListDirectoryApplicationsParams
) => Promise<types.IListDirectoryApplicationsResponse>

export const directoryControllerListDirectoryApplications: DirectoryControllerListDirectoryApplicationsFn = async ({
  tenantId,
  projectName,
  searchBy
}) => {
  const body = await fetch({
    resource: `v1/directory/tenants/${tenantId}/projects/${projectName}/applications`,
    method: 'GET',
    params: { searchBy }
  })

  return body
}
