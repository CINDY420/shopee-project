/* eslint-disable */
import { HTTPFetch as fetch } from 'src/helpers/fetch'
import * as types from '../models'

export interface IProjectController_listProjectsParams {
  tenantId: string
}

type ProjectController_listProjectsFn = (
  params: IProjectController_listProjectsParams,
  extra?: any
) => Promise<types.IListProjectsResponse>

export const projectController_listProjects: ProjectController_listProjectsFn = async (
  { tenantId },
  extra
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/projects',
      method: 'GET',
      params: { tenantId }
    },
    extra
  )

  return body
}
