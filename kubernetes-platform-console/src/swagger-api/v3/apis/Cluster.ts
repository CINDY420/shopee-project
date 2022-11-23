import fetch from 'helpers/fetch'
import * as types from '../models'

export interface IClustersControllerGetClusterInfoParams {
  clusterName: string
}

type ClustersControllerGetClusterInfoFn = (
  params: IClustersControllerGetClusterInfoParams
) => Promise<types.IClusterInfoDto>

export const clustersControllerGetClusterInfo: ClustersControllerGetClusterInfoFn = async ({ clusterName }) => {
  const body = await fetch({
    resource: `v3/clusters/${clusterName}`,
    method: 'GET'
  })

  return body
}

export interface IClustersControllerDeleteClusterParams {
  clusterName: string
}

type ClustersControllerDeleteClusterFn = (
  params: IClustersControllerDeleteClusterParams
) => Promise<types.IClusterDeleteResponseDto>

export const clustersControllerDeleteCluster: ClustersControllerDeleteClusterFn = async ({ clusterName }) => {
  const body = await fetch({
    resource: `v3/clusters/${clusterName}`,
    method: 'DELETE'
  })

  return body
}

export interface IClustersControllerCreateClusterParams {
  payload: types.IClusterCreateBodyDto
}

type ClustersControllerCreateClusterFn = (
  params: IClustersControllerCreateClusterParams
) => Promise<types.IClusterCreateBodyDto>

export const clustersControllerCreateCluster: ClustersControllerCreateClusterFn = async ({ payload }) => {
  const body = await fetch({
    resource: 'v3/clusters',
    method: 'POST',
    payload
  })

  return body
}

export interface IClustersControllerListClustersInfoParams {
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type ClustersControllerListClustersInfoFn = (
  params: IClustersControllerListClustersInfoParams
) => Promise<types.IClusterInfoListDto>

export const clustersControllerListClustersInfo: ClustersControllerListClustersInfoFn = async ({
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: 'v3/clusters',
    method: 'GET',
    params: { offset, limit, orderBy, filterBy }
  })

  return body
}

export interface IClustersControllerGetClusterConfigParams {
  clusterName: string
}

type ClustersControllerGetClusterConfigFn = (
  params: IClustersControllerGetClusterConfigParams
) => Promise<types.IClusterConfigDto>

export const clustersControllerGetClusterConfig: ClustersControllerGetClusterConfigFn = async ({ clusterName }) => {
  const body = await fetch({
    resource: `v3/clusterconfig/${clusterName}`,
    method: 'GET'
  })

  return body
}

export interface IClustersControllerUpdateClusterConfigParams {
  clusterName: string
  payload: types.IClusterConfigDto
}

type ClustersControllerUpdateClusterConfigFn = (
  params: IClustersControllerUpdateClusterConfigParams
) => Promise<types.IClusterConfigDto>

export const clustersControllerUpdateClusterConfig: ClustersControllerUpdateClusterConfigFn = async ({
  clusterName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/clusterconfig/${clusterName}`,
    method: 'PUT',
    payload
  })

  return body
}

type ClustersControllerGetClusterNamesFn = () => Promise<types.IClassNamesDto>

export const clustersControllerGetClusterNames: ClustersControllerGetClusterNamesFn = async () => {
  const body = await fetch({
    resource: 'v3/clustersnames',
    method: 'GET'
  })

  return body
}

export interface IClustersControllerListClustersInfoStatusParams {
  clusters: string
}

type ClustersControllerListClustersInfoStatusFn = (
  params: IClustersControllerListClustersInfoStatusParams
) => Promise<types.IClusterInfoListDto>

export const clustersControllerListClustersInfoStatus: ClustersControllerListClustersInfoStatusFn = async ({
  clusters
}) => {
  const body = await fetch({
    resource: 'v3/clusterstatus',
    method: 'GET',
    params: { clusters }
  })

  return body
}

export interface IClustersControllerFindResourceQuotasParams {
  clusterName: string
}

type ClustersControllerFindResourceQuotasFn = (
  params: IClustersControllerFindResourceQuotasParams
) => Promise<types.IIGetClusterQuotasResponseDto>

export const clustersControllerFindResourceQuotas: ClustersControllerFindResourceQuotasFn = async ({ clusterName }) => {
  const body = await fetch({
    resource: `v3/clusters/${clusterName}/resourceQuotas`,
    method: 'GET'
  })

  return body
}

export interface IClustersControllerUpdateQuotasParams {
  clusterName: string
  payload: types.IClusterUpdateQuotasBodyDto
}

type ClustersControllerUpdateQuotasFn = (params: IClustersControllerUpdateQuotasParams) => Promise<any>

export const clustersControllerUpdateQuotas: ClustersControllerUpdateQuotasFn = async ({ clusterName, payload }) => {
  const body = await fetch({
    resource: `v3/clusters/${clusterName}/resourceQuotas`,
    method: 'PUT',
    payload
  })

  return body
}

export interface IClustersControllerGetClusterEventsParams {
  clusterName: string
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type ClustersControllerGetClusterEventsFn = (
  params: IClustersControllerGetClusterEventsParams
) => Promise<types.IGetClusterEventsResponseDto>

export const clustersControllerGetClusterEvents: ClustersControllerGetClusterEventsFn = async ({
  clusterName,
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: `v3/clusters/${clusterName}/events`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy }
  })

  return body
}
