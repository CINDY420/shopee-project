/* eslint-disable */
import { HTTPFetch as fetch } from 'src/helpers/fetch'
import * as types from '../models'

export interface IEksClusterController_listClustersParams {
  offset?: string
  limit?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type EksClusterController_listClustersFn = (
  params: IEksClusterController_listClustersParams,
  extra?: any
) => Promise<types.IEksListClustersResponse>

export const eksClusterController_listClusters: EksClusterController_listClustersFn = async (
  { offset, limit, orderBy, filterBy, searchBy },
  extra
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/eks/clusters',
      method: 'GET',
      params: { offset, limit, orderBy, filterBy, searchBy }
    },
    extra
  )

  return body
}

export interface IEksClusterController_createEKSClusterParams {
  payload: types.IEKSCreateClusterBody
}

type EksClusterController_createEKSClusterFn = (
  params: IEksClusterController_createEKSClusterParams,
  extra?: any
) => Promise<types.IEKSCreateClusterResponse>

export const eksClusterController_createEKSCluster: EksClusterController_createEKSClusterFn =
  async ({ payload }, extra) => {
    const body = await fetch(
      {
        resource: 'ecpadmin/eks/clusters',
        method: 'POST',
        payload
      },
      extra
    )

    return body
  }

export interface IEksClusterController_getAnchorServerParams {
  env: string
  az: string
}

type EksClusterController_getAnchorServerFn = (
  params: IEksClusterController_getAnchorServerParams,
  extra?: any
) => Promise<types.IGetAnchorServerResponse>

export const eksClusterController_getAnchorServer: EksClusterController_getAnchorServerFn = async (
  { env, az },
  extra
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/eks/clusters/anchorServer',
      method: 'GET',
      params: { env, az }
    },
    extra
  )

  return body
}

export interface IEksClusterController_getClusterDetailParams {
  clusterId: number
}

type EksClusterController_getClusterDetailFn = (
  params: IEksClusterController_getClusterDetailParams,
  extra?: any
) => Promise<types.IEksGetClusterDetailResponse>

export const eksClusterController_getClusterDetail: EksClusterController_getClusterDetailFn =
  async ({ clusterId }, extra) => {
    const body = await fetch(
      {
        resource: `ecpadmin/eks/clusters/${clusterId}`,
        method: 'GET'
      },
      extra
    )

    return body
  }

export interface IEksClusterController_getClusterSummaryParams {
  clusterId: number
}

type EksClusterController_getClusterSummaryFn = (
  params: IEksClusterController_getClusterSummaryParams,
  extra?: any
) => Promise<types.IGetClusterSummaryResponse>

export const eksClusterController_getClusterSummary: EksClusterController_getClusterSummaryFn =
  async ({ clusterId }, extra) => {
    const body = await fetch(
      {
        resource: `ecpadmin/eks/clusters/${clusterId}/summary`,
        method: 'GET'
      },
      extra
    )

    return body
  }

export interface IEksClusterController_getClusterInfoByUuidParams {
  uuid: string
}

type EksClusterController_getClusterInfoByUuidFn = (
  params: IEksClusterController_getClusterInfoByUuidParams,
  extra?: any
) => Promise<types.IGetClusterInfoByUuidResponse>

export const eksClusterController_getClusterInfoByUuid: EksClusterController_getClusterInfoByUuidFn =
  async ({ uuid }, extra) => {
    const body = await fetch(
      {
        resource: `ecpadmin/eks/clusters/${uuid}/info`,
        method: 'GET'
      },
      extra
    )

    return body
  }
