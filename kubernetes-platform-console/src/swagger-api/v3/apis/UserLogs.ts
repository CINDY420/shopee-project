import fetch from 'helpers/fetch'
import * as types from '../models'

export interface IUserLogsControllerListNodesParams {
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
  startTime: string
  endTime: string
}

type UserLogsControllerListNodesFn = (params: IUserLogsControllerListNodesParams) => Promise<types.IIListLogsResponse>

export const userLogsControllerListNodes: UserLogsControllerListNodesFn = async ({
  offset,
  limit,
  orderBy,
  filterBy,
  startTime,
  endTime
}) => {
  const body = await fetch({
    resource: 'v3/operationLogs',
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, startTime, endTime }
  })

  return body
}
