/* eslint-disable */
import { HTTPFetch as fetch } from 'src/helpers/fetch'
import * as types from '../models'

export interface IClusterController_addClusterParams {
  payload: types.IAddClusterBody
}

type ClusterController_addClusterFn = (
  params: IClusterController_addClusterParams,
  extra?: any
) => Promise<any>

export const clusterController_addCluster: ClusterController_addClusterFn = async (
  { payload },
  extra
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/clusters',
      method: 'POST',
      payload
    },
    extra
  )

  return body
}

export interface IClusterController_listClustersParams {
  offset?: string
  limit?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type ClusterController_listClustersFn = (
  params: IClusterController_listClustersParams,
  extra?: any
) => Promise<types.IListClustersResponse>

export const clusterController_listClusters: ClusterController_listClustersFn = async (
  { offset, limit, orderBy, filterBy, searchBy },
  extra
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/clusters',
      method: 'GET',
      params: { offset, limit, orderBy, filterBy, searchBy }
    },
    extra
  )

  return body
}

export interface IClusterController_listClusterMetasParams {
  pageNum: string
  pageSize: string
  filterBy: string
}

type ClusterController_listClusterMetasFn = (
  params: IClusterController_listClusterMetasParams,
  extra?: any
) => Promise<types.IListClusterMetasResponse>

export const clusterController_listClusterMetas: ClusterController_listClusterMetasFn = async (
  { pageNum, pageSize, filterBy },
  extra
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/clusters/metas',
      method: 'GET',
      params: { pageNum, pageSize, filterBy }
    },
    extra
  )

  return body
}

export interface IClusterController_getClusterDetailParams {
  clusterId: string
}

type ClusterController_getClusterDetailFn = (
  params: IClusterController_getClusterDetailParams,
  extra?: any
) => Promise<types.IGetClusterDetailResponse>

export const clusterController_getClusterDetail: ClusterController_getClusterDetailFn = async (
  { clusterId },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/clusters/${clusterId}`,
      method: 'GET'
    },
    extra
  )

  return body
}

export interface IClusterController_enableKarmadaParams {
  clusterId: string
  payload: types.IEnableKarmadaBody
}

type ClusterController_enableKarmadaFn = (
  params: IClusterController_enableKarmadaParams,
  extra?: any
) => Promise<types.IEnableKarmadaResponse>

export const clusterController_enableKarmada: ClusterController_enableKarmadaFn = async (
  { clusterId, payload },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/clusters/${clusterId}:enableKarmada`,
      method: 'POST',
      payload
    },
    extra
  )

  return body
}

export interface IClusterController_addToEKSClusterParams {
  payload: types.IAddToEKSClusterBody
}

type ClusterController_addToEKSClusterFn = (
  params: IClusterController_addToEKSClusterParams,
  extra?: any
) => Promise<number>

export const clusterController_addToEKSCluster: ClusterController_addToEKSClusterFn = async (
  { payload },
  extra
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/clusters/eks',
      method: 'POST',
      payload
    },
    extra
  )

  return body
}
