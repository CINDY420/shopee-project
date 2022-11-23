/* eslint-disable */
import { HTTPFetch as fetch } from 'src/helpers/fetch'
import * as types from '../models'

export interface IAppClusterConfigController_listAppClusterConfigsParams {
  cmdbTenantId?: string
  pageNum?: string
  pageSize?: string
  filterBy?: string
}

type AppClusterConfigController_listAppClusterConfigsFn = (
  params: IAppClusterConfigController_listAppClusterConfigsParams,
  extra?: any
) => Promise<types.IListAppClusterConfigsResponse>

export const appClusterConfigController_listAppClusterConfigs: AppClusterConfigController_listAppClusterConfigsFn =
  async ({ cmdbTenantId, pageNum, pageSize, filterBy }, extra) => {
    const body = await fetch(
      {
        resource: 'ecpadmin/appClusterConfigs',
        method: 'GET',
        params: { cmdbTenantId, pageNum, pageSize, filterBy }
      },
      extra
    )

    return body
  }

export interface IAppClusterConfigController_addAppClusterConfigsParams {
  payload: types.IAddAppClusterConfigsBody
}

type AppClusterConfigController_addAppClusterConfigsFn = (
  params: IAppClusterConfigController_addAppClusterConfigsParams,
  extra?: any
) => Promise<types.IAddAppClusterConfigsResponse>

export const appClusterConfigController_addAppClusterConfigs: AppClusterConfigController_addAppClusterConfigsFn =
  async ({ payload }, extra) => {
    const body = await fetch(
      {
        resource: 'ecpadmin/appClusterConfigs:batchAdd',
        method: 'POST',
        payload
      },
      extra
    )

    return body
  }

export interface IAppClusterConfigController_removeAppClusterConfigParams {
  id: string
}

type AppClusterConfigController_removeAppClusterConfigFn = (
  params: IAppClusterConfigController_removeAppClusterConfigParams,
  extra?: any
) => Promise<any>

export const appClusterConfigController_removeAppClusterConfig: AppClusterConfigController_removeAppClusterConfigFn =
  async ({ id }, extra) => {
    const body = await fetch(
      {
        resource: `ecpadmin/appClusterConfigs/${id}`,
        method: 'DELETE'
      },
      extra
    )

    return body
  }

export interface IAppClusterConfigController_removeAppClusterConfigsParams {
  payload: types.IRemoveAppClusterConfigsBody
}

type AppClusterConfigController_removeAppClusterConfigsFn = (
  params: IAppClusterConfigController_removeAppClusterConfigsParams,
  extra?: any
) => Promise<any>

export const appClusterConfigController_removeAppClusterConfigs: AppClusterConfigController_removeAppClusterConfigsFn =
  async ({ payload }, extra) => {
    const body = await fetch(
      {
        resource: 'ecpadmin/appClusterConfigs:batchRemove',
        method: 'POST',
        payload
      },
      extra
    )

    return body
  }
