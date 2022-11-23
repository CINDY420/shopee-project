import fetch from 'helpers/fetch'
import * as types from '../models'

export interface IDeploymentsControllerGetApplicationDeployClusterDetailParams {
  tenantId: number
  projectName: string
  appName: string
  deployName: string
  clusterName: string
  clusterId: string
}

type DeploymentsControllerGetApplicationDeployClusterDetailFn = (
  params: IDeploymentsControllerGetApplicationDeployClusterDetailParams
) => Promise<types.IIDeploymentDetailResponseDto>

export const deploymentsControllerGetApplicationDeployClusterDetail: DeploymentsControllerGetApplicationDeployClusterDetailFn = async ({
  tenantId,
  projectName,
  appName,
  deployName,
  clusterName,
  clusterId
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}/clusters/${clusterName}/detail`,
    method: 'GET',
    params: { clusterId }
  })

  return body
}

export interface IDeploymentsControllerUpdateDeployLimitParams {
  tenantId: number
  projectName: string
  appName: string
  deployName: string
  clusterName: string
  payload: types.IUpdateDeployLimitBody
}

type DeploymentsControllerUpdateDeployLimitFn = (
  params: IDeploymentsControllerUpdateDeployLimitParams
) => Promise<types.IUpdateDeployLimitResponse>

export const deploymentsControllerUpdateDeployLimit: DeploymentsControllerUpdateDeployLimitFn = async ({
  tenantId,
  projectName,
  appName,
  deployName,
  clusterName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}/resources`,
    method: 'PUT',
    params: { clusterName },
    payload
  })

  return body
}

/**
 * Get container tags.
 */
export interface IDeploymentsControllerGetApplicationDeployContainerTagsParams {
  tenantId: number
  projectName: string
  appName: string
  deployName: string
  containerName: string
  clusterId: string
}

/**
 * Get container tags.
 */
type DeploymentsControllerGetApplicationDeployContainerTagsFn = (
  params: IDeploymentsControllerGetApplicationDeployContainerTagsParams
) => Promise<types.IIGetDeployContainerTagsResponseDto>

/**
 * Get container tags.
 */
export const deploymentsControllerGetApplicationDeployContainerTags: DeploymentsControllerGetApplicationDeployContainerTagsFn = async ({
  tenantId,
  projectName,
  appName,
  deployName,
  containerName,
  clusterId
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}/containers/${containerName}/tags`,
    method: 'GET',
    params: { clusterId }
  })

  return body
}

/**
 * Batch scale deploys.
 */
export interface IDeploymentsControllerScaleApplicationDeploysParams {
  tenantId: number
  projectName: string
  appName: string
  payload: types.IScaleDeployBody
}

/**
 * Batch scale deploys.
 */
type DeploymentsControllerScaleApplicationDeploysFn = (
  params: IDeploymentsControllerScaleApplicationDeploysParams
) => Promise<types.IIDeployScaleResponseDto>

/**
 * Batch scale deploys.
 */
export const deploymentsControllerScaleApplicationDeploys: DeploymentsControllerScaleApplicationDeploysFn = async ({
  tenantId,
  projectName,
  appName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploysscale`,
    method: 'PUT',
    payload
  })

  return body
}

/**
 * Batch cancel canary for deploys.
 */
export interface IDeploymentsControllerCancelCanaryApplicationDeploysParams {
  tenantId: number
  projectName: string
  appName: string
  payload: types.ICancelCanaryDeployBody
}

/**
 * Batch cancel canary for deploys.
 */
type DeploymentsControllerCancelCanaryApplicationDeploysFn = (
  params: IDeploymentsControllerCancelCanaryApplicationDeploysParams
) => Promise<types.IIDeployScaleResponseDto>

/**
 * Batch cancel canary for deploys.
 */
export const deploymentsControllerCancelCanaryApplicationDeploys: DeploymentsControllerCancelCanaryApplicationDeploysFn = async ({
  tenantId,
  projectName,
  appName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/cancelcanary`,
    method: 'PUT',
    payload
  })

  return body
}

/**
 * Batch full release deploys.
 */
export interface IDeploymentsControllerFullReleaseApplicationDeploysParams {
  tenantId: number
  projectName: string
  appName: string
  payload: types.IFullReleaseBody
}

/**
 * Batch full release deploys.
 */
type DeploymentsControllerFullReleaseApplicationDeploysFn = (
  params: IDeploymentsControllerFullReleaseApplicationDeploysParams
) => Promise<types.IIDeployScaleResponseDto>

/**
 * Batch full release deploys.
 */
export const deploymentsControllerFullReleaseApplicationDeploys: DeploymentsControllerFullReleaseApplicationDeploysFn = async ({
  tenantId,
  projectName,
  appName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploysfullRelease`,
    method: 'PUT',
    payload
  })

  return body
}

/**
 * Batch rollback deploys.
 */
export interface IDeploymentsControllerRollbackDeploymentParams {
  tenantId: number
  projectName: string
  appName: string
  payload: types.IRollbackDeploymentRequestBodyDto
}

/**
 * Batch rollback deploys.
 */
type DeploymentsControllerRollbackDeploymentFn = (
  params: IDeploymentsControllerRollbackDeploymentParams
) => Promise<types.IIDeployScaleResponseDto>

/**
 * Batch rollback deploys.
 */
export const deploymentsControllerRollbackDeployment: DeploymentsControllerRollbackDeploymentFn = async ({
  tenantId,
  projectName,
  appName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploysrollback`,
    method: 'PUT',
    payload
  })

  return body
}

/**
 * Batch rollout restart deploys.
 */
export interface IDeploymentsControllerRolloutRestartDeploymentParams {
  tenantId: number
  projectName: string
  appName: string
  payload: types.IRolloutRestartDeploymentRequestBodyDto
}

/**
 * Batch rollout restart deploys.
 */
type DeploymentsControllerRolloutRestartDeploymentFn = (
  params: IDeploymentsControllerRolloutRestartDeploymentParams
) => Promise<any>

/**
 * Batch rollout restart deploys.
 */
export const deploymentsControllerRolloutRestartDeployment: DeploymentsControllerRolloutRestartDeploymentFn = async ({
  tenantId,
  projectName,
  appName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploysrolloutRestart`,
    method: 'PUT',
    payload
  })

  return body
}

export interface IDeploymentsControllerGetDeploymentBasicInfoParams {
  tenantId: number
  projectName: string
  appName: string
  deployName: string
  clusterName: string
  clusterId: string
  isCanary: boolean
}

type DeploymentsControllerGetDeploymentBasicInfoFn = (
  params: IDeploymentsControllerGetDeploymentBasicInfoParams
) => Promise<types.IGetDeploymentBasicInfoResponseDto>

export const deploymentsControllerGetDeploymentBasicInfo: DeploymentsControllerGetDeploymentBasicInfoFn = async ({
  tenantId,
  projectName,
  appName,
  deployName,
  clusterName,
  clusterId,
  isCanary
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}/clusters/${clusterName}/basicInfo`,
    method: 'GET',
    params: { clusterId, isCanary }
  })

  return body
}

export interface IDeploymentsControllerGetDeploymentEventsParams {
  tenantId: number
  projectName: string
  appName: string
  deployName: string
  clusterId: string
  phase: string
  types?: string
}

type DeploymentsControllerGetDeploymentEventsFn = (
  params: IDeploymentsControllerGetDeploymentEventsParams
) => Promise<types.IIDeploymentLatestEvents>

export const deploymentsControllerGetDeploymentEvents: DeploymentsControllerGetDeploymentEventsFn = async ({
  tenantId,
  projectName,
  appName,
  deployName,
  clusterId,
  phase,
  types
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}/latestAbnormalEvents`,
    method: 'GET',
    params: { clusterId, phase, types }
  })

  return body
}

export interface IDeploymentsControllerDeleteDeploymenyParams {
  tenantId: number
  projectName: string
  appName: string
  deployName: string
  payload: types.IDeleteDeploymentBody
}

type DeploymentsControllerDeleteDeploymenyFn = (
  params: IDeploymentsControllerDeleteDeploymenyParams
) => Promise<types.IIDeployScaleResponseDto>

export const deploymentsControllerDeleteDeploymeny: DeploymentsControllerDeleteDeploymenyFn = async ({
  tenantId,
  projectName,
  appName,
  deployName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}`,
    method: 'DELETE',
    payload
  })

  return body
}
