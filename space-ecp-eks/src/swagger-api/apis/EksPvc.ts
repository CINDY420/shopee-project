/* eslint-disable */
import fetch from 'src/helpers/fetch'
import * as types from '../models'

export interface IEksPvcController_listPvcsParams {
  clusterId: number
  offset?: string
  limit?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type EksPvcController_listPvcsFn = (
  params: IEksPvcController_listPvcsParams
) => Promise<types.IEksListPvcResponse>

export const eksPvcController_listPvcs: EksPvcController_listPvcsFn = async ({
  clusterId,
  offset,
  limit,
  orderBy,
  filterBy,
  searchBy
}) => {
  const body = await fetch({
    resource: `ecpadmin/eks/clusters/${clusterId}/pvcs`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, searchBy }
  })

  return body
}

export interface IEksPvcController_getPvcNameSpaceParams {
  clusterId: number
  searchBy?: string
}

type EksPvcController_getPvcNameSpaceFn = (
  params: IEksPvcController_getPvcNameSpaceParams
) => Promise<types.IEksGetPvcNamespaceResponse>

export const eksPvcController_getPvcNameSpace: EksPvcController_getPvcNameSpaceFn = async ({
  clusterId,
  searchBy
}) => {
  const body = await fetch({
    resource: `ecpadmin/eks/clusters/${clusterId}/pvcNamespace`,
    method: 'GET',
    params: { searchBy }
  })

  return body
}
