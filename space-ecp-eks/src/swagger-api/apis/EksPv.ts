/* eslint-disable */
import fetch from 'src/helpers/fetch'
import * as types from '../models'

export interface IEksPvController_litPvsParams {
  clusterId: number
  offset?: string
  limit?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type EksPvController_litPvsFn = (
  params: IEksPvController_litPvsParams
) => Promise<types.IEksListPvsResponse>

export const eksPvController_litPvs: EksPvController_litPvsFn = async ({
  clusterId,
  offset,
  limit,
  orderBy,
  filterBy,
  searchBy
}) => {
  const body = await fetch({
    resource: `ecpadmin/eks/clusters/${clusterId}/pvs`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, searchBy }
  })

  return body
}
