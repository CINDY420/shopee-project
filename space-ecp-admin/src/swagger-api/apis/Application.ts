/* eslint-disable */
import { HTTPFetch as fetch } from 'src/helpers/fetch'
import * as types from '../models'

export interface IApplicationController_listApplicationsParams {
  id: string
  scope: 'tenant' | 'project'
}

type ApplicationController_listApplicationsFn = (
  params: IApplicationController_listApplicationsParams,
  extra?: any
) => Promise<types.IListApplicationsResponse>

export const applicationController_listApplications: ApplicationController_listApplicationsFn =
  async ({ id, scope }, extra) => {
    const body = await fetch(
      {
        resource: 'ecpadmin/applications',
        method: 'GET',
        params: { id, scope }
      },
      extra
    )

    return body
  }
