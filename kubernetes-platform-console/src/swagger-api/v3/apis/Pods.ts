import fetch from 'helpers/fetch'
import * as types from '../models'

/**
 * Get deploy pod list.
 */
export interface IPodsControllerGetDeploymentPodsParams {
  tenantId: number
  projectName: string
  appName: string
  deployName: string
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
  clusterId: string
  phase: string
}

/**
 * Get deploy pod list.
 */
type PodsControllerGetDeploymentPodsFn = (
  params: IPodsControllerGetDeploymentPodsParams
) => Promise<types.IIPodListResponse>

/**
 * Get deploy pod list.
 */
export const podsControllerGetDeploymentPods: PodsControllerGetDeploymentPodsFn = async ({
  tenantId,
  projectName,
  appName,
  deployName,
  offset,
  limit,
  orderBy,
  filterBy,
  clusterId,
  phase
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}/pods`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, clusterId, phase }
  })

  return body
}

export interface IPodsControllerGetApplicationEventsParams {
  tenantId: number
  projectName: string
  appName: string
  podName: string
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
  clusterId: string
}

type PodsControllerGetApplicationEventsFn = (
  params: IPodsControllerGetApplicationEventsParams
) => Promise<types.IGetApplicationEventsResponseDto>

export const podsControllerGetApplicationEvents: PodsControllerGetApplicationEventsFn = async ({
  tenantId,
  projectName,
  appName,
  podName,
  offset,
  limit,
  orderBy,
  filterBy,
  clusterId
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/pods/${podName}/events`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, clusterId }
  })

  return body
}

export interface IPodsControllerGetPodDetailParams {
  tenantId: number
  projectName: string
  appName: string
  podName: string
  clusterId: string
}

type PodsControllerGetPodDetailFn = (
  params: IPodsControllerGetPodDetailParams
) => Promise<types.IGetPodDetailResponseDto>

export const podsControllerGetPodDetail: PodsControllerGetPodDetailFn = async ({
  tenantId,
  projectName,
  appName,
  podName,
  clusterId
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/pods/${podName}`,
    method: 'GET',
    params: { clusterId }
  })

  return body
}

export interface IPodsControllerDeleteOnePodParams {
  tenantId: number
  projectName: string
  appName: string
  podName: string
  clusterId: string
}

type PodsControllerDeleteOnePodFn = (params: IPodsControllerDeleteOnePodParams) => Promise<any>

export const podsControllerDeleteOnePod: PodsControllerDeleteOnePodFn = async ({
  tenantId,
  projectName,
  appName,
  podName,
  clusterId
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/pods/${podName}`,
    method: 'DELETE',
    params: { clusterId }
  })

  return body
}

/**
 * Get container envs.
 */
export interface IPodsControllerGetPodContainerEnvsParams {
  tenantId: number
  projectName: string
  appName: string
  podName: string
  containerName: string
  clusterId: string
}

/**
 * Get container envs.
 */
type PodsControllerGetPodContainerEnvsFn = (
  params: IPodsControllerGetPodContainerEnvsParams
) => Promise<types.IGetPodContainerResponseDto>

/**
 * Get container envs.
 */
export const podsControllerGetPodContainerEnvs: PodsControllerGetPodContainerEnvsFn = async ({
  tenantId,
  projectName,
  appName,
  podName,
  containerName,
  clusterId
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/pods/${podName}/containers/${containerName}/envs`,
    method: 'GET',
    params: { clusterId }
  })

  return body
}

export interface IPodsControllerBatchDeletePodsParams {
  tenantId: number
  projectName: string
  appName: string
  payload: types.IIBatchDeletePodsPayload
}

type PodsControllerBatchDeletePodsFn = (params: IPodsControllerBatchDeletePodsParams) => Promise<any>

export const podsControllerBatchDeletePods: PodsControllerBatchDeletePodsFn = async ({
  tenantId,
  projectName,
  appName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/pods`,
    method: 'DELETE',
    payload
  })

  return body
}

export interface IPodsControllerGetPodContainerFileLogParams {
  tenantId: number
  projectName: string
  appName: string
  podName: string
  containerName: string
  fileName: string
  clusterId: string
  searchBy: string
}

type PodsControllerGetPodContainerFileLogFn = (params: IPodsControllerGetPodContainerFileLogParams) => Promise<any>

export const podsControllerGetPodContainerFileLog: PodsControllerGetPodContainerFileLogFn = async ({
  tenantId,
  projectName,
  appName,
  podName,
  containerName,
  fileName,
  clusterId,
  searchBy
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/pods/${podName}/containers/${containerName}/logDirectory/${fileName}`,
    method: 'GET',
    params: { clusterId, searchBy }
  })

  return body
}

export interface IPodsControllerGetLogDirectoryParams {
  tenantId: number
  projectName: string
  appName: string
  podName: string
  containerName: string
  clusterId: string
}

type PodsControllerGetLogDirectoryFn = (
  params: IPodsControllerGetLogDirectoryParams
) => Promise<types.IGetLogDirectoryResponseDto>

export const podsControllerGetLogDirectory: PodsControllerGetLogDirectoryFn = async ({
  tenantId,
  projectName,
  appName,
  podName,
  containerName,
  clusterId
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/pods/${podName}/containers/${containerName}/logDirectory`,
    method: 'GET',
    params: { clusterId }
  })

  return body
}

export interface IPodsControllerGetLogPrevousLogParams {
  tenantId: number
  projectName: string
  appName: string
  podName: string
  containerName: string
  clusterId: string
}

type PodsControllerGetLogPrevousLogFn = (
  params: IPodsControllerGetLogPrevousLogParams
) => Promise<types.IGetPodPreviousLogResponse>

export const podsControllerGetLogPrevousLog: PodsControllerGetLogPrevousLogFn = async ({
  tenantId,
  projectName,
  appName,
  podName,
  containerName,
  clusterId
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/pods/${podName}/containers/${containerName}/previousLog`,
    method: 'GET',
    params: { clusterId }
  })

  return body
}
