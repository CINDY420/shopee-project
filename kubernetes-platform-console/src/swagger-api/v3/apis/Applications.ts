import fetch from 'helpers/fetch'
import * as types from '../models'

export interface IApplicationsControllerGetProjectApplicationsParams {
  tenantId: number
  projectName: string
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type ApplicationsControllerGetProjectApplicationsFn = (
  params: IApplicationsControllerGetProjectApplicationsParams
) => Promise<types.IProjectApplicationsResponseDto>

export const applicationsControllerGetProjectApplications: ApplicationsControllerGetProjectApplicationsFn = async ({
  tenantId,
  projectName,
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy }
  })

  return body
}

export interface IApplicationsControllerCreateApplicationParams {
  tenantId: string
  projectName: string
  payload: types.IICreateApplicationDto
}

type ApplicationsControllerCreateApplicationFn = (
  params: IApplicationsControllerCreateApplicationParams
) => Promise<types.IIApplicationTemplate>

export const applicationsControllerCreateApplication: ApplicationsControllerCreateApplicationFn = async ({
  tenantId,
  projectName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps`,
    method: 'POST',
    payload
  })

  return body
}

export interface IApplicationsControllerGetApplicationParams {
  tenantId: number
  projectName: string
  appName: string
}

type ApplicationsControllerGetApplicationFn = (
  params: IApplicationsControllerGetApplicationParams
) => Promise<types.IApplicationGetResponseDto>

export const applicationsControllerGetApplication: ApplicationsControllerGetApplicationFn = async ({
  tenantId,
  projectName,
  appName
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}`,
    method: 'GET'
  })

  return body
}

export interface IApplicationsControllerDeleteApplicationParams {
  tenantId: string
  projectName: string
  name: string
}

type ApplicationsControllerDeleteApplicationFn = (
  params: IApplicationsControllerDeleteApplicationParams
) => Promise<any>

export const applicationsControllerDeleteApplication: ApplicationsControllerDeleteApplicationFn = async ({
  tenantId,
  projectName,
  name
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${name}`,
    method: 'DELETE'
  })

  return body
}

export interface IApplicationsControllerGetDeploysFilterInfoParams {
  tenantId: number
  projectName: string
  appName: string
}

type ApplicationsControllerGetDeploysFilterInfoFn = (
  params: IApplicationsControllerGetDeploysFilterInfoParams
) => Promise<types.IApplicationDeploysFilterInfo>

export const applicationsControllerGetDeploysFilterInfo: ApplicationsControllerGetDeploysFilterInfoFn = async ({
  tenantId,
  projectName,
  appName
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploysFilterInfo`,
    method: 'GET'
  })

  return body
}

/**
 * Get application deploy list.
 */
export interface IApplicationsControllerGetApplicationDeploysParams {
  tenantId: number
  projectName: string
  appName: string
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
  cid?: string
  env?: string
  cluster?: string
}

/**
 * Get application deploy list.
 */
type ApplicationsControllerGetApplicationDeploysFn = (
  params: IApplicationsControllerGetApplicationDeploysParams
) => Promise<types.IApplicationDeploysResponseDto>

/**
 * Get application deploy list.
 */
export const applicationsControllerGetApplicationDeploys: ApplicationsControllerGetApplicationDeploysFn = async ({
  tenantId,
  projectName,
  appName,
  offset,
  limit,
  orderBy,
  filterBy,
  cid,
  env,
  cluster
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, cid, env, cluster }
  })

  return body
}

export interface IApplicationsControllerGetApplicationEventsParams {
  tenantId: number
  projectName: string
  appName: string
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type ApplicationsControllerGetApplicationEventsFn = (
  params: IApplicationsControllerGetApplicationEventsParams
) => Promise<types.IGetApplicationEventsResponseDto>

export const applicationsControllerGetApplicationEvents: ApplicationsControllerGetApplicationEventsFn = async ({
  tenantId,
  projectName,
  appName,
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/events`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy }
  })

  return body
}

export interface IApplicationsControllerGetApplicationConfigHistoryParams {
  tenantId: number
  projectName: string
  appName: string
  env: string
  cluster: string
  searchBy?: string
}

type ApplicationsControllerGetApplicationConfigHistoryFn = (
  params: IApplicationsControllerGetApplicationConfigHistoryParams
) => Promise<types.IIApplicationConfigHistoryListDto>

export const applicationsControllerGetApplicationConfigHistory: ApplicationsControllerGetApplicationConfigHistoryFn = async ({
  tenantId,
  projectName,
  appName,
  env,
  cluster,
  searchBy
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/configHistory`,
    method: 'GET',
    params: { env, cluster, searchBy }
  })

  return body
}

export interface IApplicationsControllerGetApplicationReleaseConfigParams {
  tenantId: number
  projectName: string
  appName: string
  env: string
  cluster: string
}

type ApplicationsControllerGetApplicationReleaseConfigFn = (
  params: IApplicationsControllerGetApplicationReleaseConfigParams
) => Promise<types.IIConfigReleaseResponseDto>

export const applicationsControllerGetApplicationReleaseConfig: ApplicationsControllerGetApplicationReleaseConfigFn = async ({
  tenantId,
  projectName,
  appName,
  env,
  cluster
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/configRelease`,
    method: 'GET',
    params: { env, cluster }
  })

  return body
}

export interface IApplicationsControllerGetApplicationLatestConfigParams {
  tenantId: number
  projectName: string
  appName: string
  env: string
  cluster: string
}

type ApplicationsControllerGetApplicationLatestConfigFn = (
  params: IApplicationsControllerGetApplicationLatestConfigParams
) => Promise<types.IIConfigReleaseResponseDto>

export const applicationsControllerGetApplicationLatestConfig: ApplicationsControllerGetApplicationLatestConfigFn = async ({
  tenantId,
  projectName,
  appName,
  env,
  cluster
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/configLatest`,
    method: 'GET',
    params: { env, cluster }
  })

  return body
}

export interface IApplicationsControllerCreateApplicationConfigParams {
  tenantId: number
  projectName: string
  appName: string
  payload: types.IICreateApplicationConfigBodyDto
}

type ApplicationsControllerCreateApplicationConfigFn = (
  params: IApplicationsControllerCreateApplicationConfigParams
) => Promise<types.IINewApplicationConfigDto>

export const applicationsControllerCreateApplicationConfig: ApplicationsControllerCreateApplicationConfigFn = async ({
  tenantId,
  projectName,
  appName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/config`,
    method: 'POST',
    payload
  })

  return body
}

export interface IApplicationsControllerGetApplicationTerminalCommandLogsParams {
  tenantId: string
  projectName: string
  appName: string
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
  startTime?: string
  endTime?: string
}

type ApplicationsControllerGetApplicationTerminalCommandLogsFn = (
  params: IApplicationsControllerGetApplicationTerminalCommandLogsParams
) => Promise<types.IApplicationTerminalLogsResponseDto>

export const applicationsControllerGetApplicationTerminalCommandLogs: ApplicationsControllerGetApplicationTerminalCommandLogsFn = async ({
  tenantId,
  projectName,
  appName,
  offset,
  limit,
  orderBy,
  filterBy,
  startTime,
  endTime
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/terminalCommandLogs`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, startTime, endTime }
  })

  return body
}

export interface IApplicationsControllerGetApplicationTerminalCommandReplaysParams {
  tenantId: string
  projectName: string
  appName: string
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
  startTime?: string
  endTime?: string
}

type ApplicationsControllerGetApplicationTerminalCommandReplaysFn = (
  params: IApplicationsControllerGetApplicationTerminalCommandReplaysParams
) => Promise<types.IApplicationTerminalReplaysResponseDto>

export const applicationsControllerGetApplicationTerminalCommandReplays: ApplicationsControllerGetApplicationTerminalCommandReplaysFn = async ({
  tenantId,
  projectName,
  appName,
  offset,
  limit,
  orderBy,
  filterBy,
  startTime,
  endTime
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/terminalCommandReplays`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, startTime, endTime }
  })

  return body
}

export interface IApplicationsControllerGetApplicationTerminalCommandReplayDetailParams {
  tenantId: string
  projectName: string
  appName: string
  sessionId: string
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
  createdTime: string
}

type ApplicationsControllerGetApplicationTerminalCommandReplayDetailFn = (
  params: IApplicationsControllerGetApplicationTerminalCommandReplayDetailParams
) => Promise<types.IReplay>

export const applicationsControllerGetApplicationTerminalCommandReplayDetail: ApplicationsControllerGetApplicationTerminalCommandReplayDetailFn = async ({
  tenantId,
  projectName,
  appName,
  sessionId,
  offset,
  limit,
  orderBy,
  filterBy,
  createdTime
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/terminalCommandReplay/${sessionId}`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, createdTime }
  })

  return body
}

export interface IApplicationsControllerGetApplicationTerminalCommandReplayFileDataParams {
  tenantId: string
  projectName: string
  appName: string
  sessionId: string
  createdTime: string
}

type ApplicationsControllerGetApplicationTerminalCommandReplayFileDataFn = (
  params: IApplicationsControllerGetApplicationTerminalCommandReplayFileDataParams
) => Promise<types.IWriteStream>

export const applicationsControllerGetApplicationTerminalCommandReplayFileData: ApplicationsControllerGetApplicationTerminalCommandReplayFileDataFn = async ({
  tenantId,
  projectName,
  appName,
  sessionId,
  createdTime
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/terminalCommandReplay/${sessionId}/fileData`,
    method: 'GET',
    params: { createdTime }
  })

  return body
}
