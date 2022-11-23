/* eslint-disable */
import { HTTPFetch as fetch } from 'src/helpers/fetch'
import * as types from '../models'

export interface INodeController_listNodesParams {
  clusterId: string
  offset?: string
  limit?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type NodeController_listNodesFn = (
  params: INodeController_listNodesParams,
  extra?: any
) => Promise<types.IListNodesResponse>

export const nodeController_listNodes: NodeController_listNodesFn = async (
  { clusterId, offset, limit, orderBy, filterBy, searchBy },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/clusters/${clusterId}/nodes`,
      method: 'GET',
      params: { offset, limit, orderBy, filterBy, searchBy }
    },
    extra
  )

  return body
}
