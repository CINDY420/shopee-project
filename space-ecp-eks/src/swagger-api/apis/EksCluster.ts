/* eslint-disable */
import fetch from 'src/helpers/fetch'
import * as types from '../models'

export interface IEksClusterController_listClustersParams {
  offset?: string
  limit?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type EksClusterController_listClustersFn = (
  params: IEksClusterController_listClustersParams
) => Promise<types.IEksListClustersResponse>

export const eksClusterController_listClusters: EksClusterController_listClustersFn = async ({
  offset,
  limit,
  orderBy,
  filterBy,
  searchBy
}) => {
  const body = await fetch({
    resource: 'ecpadmin/eks/clusters',
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, searchBy }
  })

  return body
}

export interface IEksClusterController_createEKSClusterParams {
  payload: types.IEKSCreateClusterBody
}

type EksClusterController_createEKSClusterFn = (
  params: IEksClusterController_createEKSClusterParams
) => Promise<types.IEKSCreateClusterResponse>

export const eksClusterController_createEKSCluster: EksClusterController_createEKSClusterFn =
  async ({ payload }) => {
    const body = await fetch({
      resource: 'ecpadmin/eks/clusters',
      method: 'POST',
      payload
    })

    return body
  }

export interface IEksClusterController_getAnchorServerParams {
  env: string
  az: string
}

type EksClusterController_getAnchorServerFn = (
  params: IEksClusterController_getAnchorServerParams
) => Promise<types.IGetAnchorServerResponse>

export const eksClusterController_getAnchorServer: EksClusterController_getAnchorServerFn = async ({
  env,
  az
}) => {
  const body = await fetch({
    resource: 'ecpadmin/eks/clusters/anchorServer',
    method: 'GET',
    params: { env, az }
  })

  return body
}

export interface IEksClusterController_getClusterDetailParams {
  clusterId: number
}

type EksClusterController_getClusterDetailFn = (
  params: IEksClusterController_getClusterDetailParams
) => Promise<types.IEksGetClusterDetailResponse>

export const eksClusterController_getClusterDetail: EksClusterController_getClusterDetailFn =
  async ({ clusterId }) => {
    const body = await fetch({
      resource: `ecpadmin/eks/clusters/${clusterId}`,
      method: 'GET'
    })

    return body
  }

export interface IEksClusterController_getClusterSummaryParams {
  clusterId: number
}

type EksClusterController_getClusterSummaryFn = (
  params: IEksClusterController_getClusterSummaryParams
) => Promise<types.IGetClusterSummaryResponse>

export const eksClusterController_getClusterSummary: EksClusterController_getClusterSummaryFn =
  async ({ clusterId }) => {
    const body = await fetch({
      resource: `ecpadmin/eks/clusters/${clusterId}/summary`,
      method: 'GET'
    })

    return body
  }

export interface IEksClusterController_getClusterInfoByUuidParams {
  uuid: string
}

type EksClusterController_getClusterInfoByUuidFn = (
  params: IEksClusterController_getClusterInfoByUuidParams
) => Promise<types.IGetClusterInfoByUuidResponse>

export const eksClusterController_getClusterInfoByUuid: EksClusterController_getClusterInfoByUuidFn =
  async ({ uuid }) => {
    const body = await fetch({
      resource: `ecpadmin/eks/clusters/${uuid}/info`,
      method: 'GET'
    })

    return body
  }
