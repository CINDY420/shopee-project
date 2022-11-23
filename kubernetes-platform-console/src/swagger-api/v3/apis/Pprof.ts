import fetch from 'helpers/fetch'
import * as types from '../models'

export interface IPprofControllerCreatePprofParams {
  tenantId: string
  projectName: string
  appName: string
  deployName: string
  payload: types.ICreatePprofRequest
}

type PprofControllerCreatePprofFn = (params: IPprofControllerCreatePprofParams) => Promise<types.ICreatePprofResponse>

export const pprofControllerCreatePprof: PprofControllerCreatePprofFn = async ({
  tenantId,
  projectName,
  appName,
  deployName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}/pprof`,
    method: 'POST',
    payload
  })

  return body
}

export interface IPprofControllerGetPprofListParams {
  tenantId: string
  projectName: string
  appName: string
  deployName: string
  offset: number
  limit: number
  filterBy: string
  orderBy: string
}

type PprofControllerGetPprofListFn = (
  params: IPprofControllerGetPprofListParams
) => Promise<types.IGetPprofListResponse>

export const pprofControllerGetPprofList: PprofControllerGetPprofListFn = async ({
  tenantId,
  projectName,
  appName,
  deployName,
  offset,
  limit,
  filterBy,
  orderBy
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}/pprof`,
    method: 'GET',
    params: { offset, limit, filterBy, orderBy }
  })

  return body
}

export interface IPprofControllerGetPprofParams {
  tenantId: string
  projectName: string
  appName: string
  deployName: string
  profileId: string
}

type PprofControllerGetPprofFn = (params: IPprofControllerGetPprofParams) => Promise<types.IGetPprofResponse>

export const pprofControllerGetPprof: PprofControllerGetPprofFn = async ({
  tenantId,
  projectName,
  appName,
  deployName,
  profileId
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}/pprof/detail/${profileId}`,
    method: 'GET'
  })

  return body
}

export interface IPprofControllerGetPprofObjectParams {
  tenantId: string
  projectName: string
  appName: string
  deployName: string
}

type PprofControllerGetPprofObjectFn = (
  params: IPprofControllerGetPprofObjectParams
) => Promise<types.IGetPprofObjectResponse>

export const pprofControllerGetPprofObject: PprofControllerGetPprofObjectFn = async ({
  tenantId,
  projectName,
  appName,
  deployName
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}/pprof/objects`,
    method: 'GET'
  })

  return body
}

export interface IPprofControllerCreatePprofCronjobParams {
  tenantId: string
  projectName: string
  appName: string
  deployName: string
  payload: types.ICreatePprofCronjobRequest
}

type PprofControllerCreatePprofCronjobFn = (
  params: IPprofControllerCreatePprofCronjobParams
) => Promise<types.ICreatePprofCronjobResponse>

export const pprofControllerCreatePprofCronjob: PprofControllerCreatePprofCronjobFn = async ({
  tenantId,
  projectName,
  appName,
  deployName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}/pprof/cronjob`,
    method: 'POST',
    payload
  })

  return body
}

export interface IPprofControllerGetPprofCronjobParams {
  tenantId: string
  projectName: string
  appName: string
  deployName: string
  cluster: string
}

type PprofControllerGetPprofCronjobFn = (
  params: IPprofControllerGetPprofCronjobParams
) => Promise<types.IGetPprofCronjobResponse>

export const pprofControllerGetPprofCronjob: PprofControllerGetPprofCronjobFn = async ({
  tenantId,
  projectName,
  appName,
  deployName,
  cluster
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/apps/${appName}/deploys/${deployName}/pprof/cronjob`,
    method: 'GET',
    params: { cluster }
  })

  return body
}
