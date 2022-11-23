/* eslint-disable */
import { HTTPFetch as fetch } from 'src/helpers/fetch'
import * as types from '../models'

type EtcdClusterController_listEnvAzFn = (extra?: any) => Promise<types.IListEtcdEnvAzsResponse>

export const etcdClusterController_listEnvAz: EtcdClusterController_listEnvAzFn = async (
  extra?: any
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/etcd/clusters/envAzs',
      method: 'GET'
    },
    extra
  )

  return body
}

export interface IEtcdClusterController_listClustersParams {
  offset?: string
  limit?: string
  env?: string
  az?: string
  region?: string
  labels?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type EtcdClusterController_listClustersFn = (
  params: IEtcdClusterController_listClustersParams,
  extra?: any
) => Promise<types.IListEtcdClustersResponse>

export const etcdClusterController_listClusters: EtcdClusterController_listClustersFn = async (
  { offset, limit, env, az, region, labels, orderBy, filterBy, searchBy },
  extra
) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/etcd/clusters',
      method: 'GET',
      params: { offset, limit, env, az, region, labels, orderBy, filterBy, searchBy }
    },
    extra
  )

  return body
}

export interface IEtcdClusterController_getClusterDetailParams {
  clusterId: string
  offset?: string
  limit?: string
  env?: string
  az?: string
  region?: string
  labels?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type EtcdClusterController_getClusterDetailFn = (
  params: IEtcdClusterController_getClusterDetailParams,
  extra?: any
) => Promise<types.IGetEtcdClusterDetailResponse>

export const etcdClusterController_getClusterDetail: EtcdClusterController_getClusterDetailFn =
  async (
    { clusterId, offset, limit, env, az, region, labels, orderBy, filterBy, searchBy },
    extra
  ) => {
    const body = await fetch(
      {
        resource: `ecpadmin/etcd/clusters/${clusterId}`,
        method: 'GET',
        params: { offset, limit, env, az, region, labels, orderBy, filterBy, searchBy }
      },
      extra
    )

    return body
  }
