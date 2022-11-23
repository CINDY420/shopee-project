/* eslint-disable */
import { HTTPFetch as fetch } from 'src/helpers/fetch'
import * as types from '../models'

export interface IEksJobController_litJobsParams {
  clusterId: number
  offset?: string
  limit?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type EksJobController_litJobsFn = (
  params: IEksJobController_litJobsParams,
  extra?: any
) => Promise<types.IEksListJobsResponse>

export const eksJobController_litJobs: EksJobController_litJobsFn = async (
  { clusterId, offset, limit, orderBy, filterBy, searchBy },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/eks/clusters/${clusterId}/jobs`,
      method: 'GET',
      params: { offset, limit, orderBy, filterBy, searchBy }
    },
    extra
  )

  return body
}
