import fetch from 'helpers/fetch'
import * as types from '../models'

type TreesControllerGetTenantProjectTreeFn = () => Promise<types.IITenantTree>

export const treesControllerGetTenantProjectTree: TreesControllerGetTenantProjectTreeFn = async () => {
  const body = await fetch({
    resource: 'v3/tree/projects',
    method: 'GET'
  })

  return body
}

export interface ITreesControllerGetApplicationTreeParams {
  tenantId: number
  projectName: string
}

type TreesControllerGetApplicationTreeFn = (
  params: ITreesControllerGetApplicationTreeParams
) => Promise<types.IIApplicationTree>

export const treesControllerGetApplicationTree: TreesControllerGetApplicationTreeFn = async ({
  tenantId,
  projectName
}) => {
  const body = await fetch({
    resource: `v3/tree/tenants/${tenantId}/projects/${projectName}/apps`,
    method: 'GET'
  })

  return body
}
