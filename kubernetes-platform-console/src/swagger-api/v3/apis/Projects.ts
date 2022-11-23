import fetch from 'helpers/fetch'
import * as types from '../models'

export interface IProjectsControllerGetDetailParams {
  tenantId: number
  projectName: string
}

type ProjectsControllerGetDetailFn = (
  params: IProjectsControllerGetDetailParams
) => Promise<types.IIGetProjectDetailDtoResponse>

export const projectsControllerGetDetail: ProjectsControllerGetDetailFn = async ({ tenantId, projectName }) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}`,
    method: 'GET'
  })

  return body
}

export interface IProjectsControllerDeleteProjectParams {
  tenantId: number
  projectName: string
}

type ProjectsControllerDeleteProjectFn = (params: IProjectsControllerDeleteProjectParams) => Promise<{}>

export const projectsControllerDeleteProject: ProjectsControllerDeleteProjectFn = async ({ tenantId, projectName }) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}`,
    method: 'DELETE'
  })

  return body
}

export interface IProjectsControllerUpdateParams {
  tenantId: number
  projectName: string
  payload: types.IIPlayLoadInfo
}

type ProjectsControllerUpdateFn = (params: IProjectsControllerUpdateParams) => Promise<types.IIESProjectDetailResponse>

export const projectsControllerUpdate: ProjectsControllerUpdateFn = async ({ tenantId, projectName, payload }) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}`,
    method: 'PUT',
    payload
  })

  return body
}

export interface IProjectsControllerGetClusterListByConfigInfoParams {
  tenantId: number
  projectName: string
  environments: string[]
  cids: string[]
}

type ProjectsControllerGetClusterListByConfigInfoFn = (
  params: IProjectsControllerGetClusterListByConfigInfoParams
) => Promise<types.IClusterListByConfigInfoResponse>

export const projectsControllerGetClusterListByConfigInfo: ProjectsControllerGetClusterListByConfigInfoFn = async ({
  tenantId,
  projectName,
  environments,
  cids
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/clusterListByConfigInfo`,
    method: 'GET',
    params: { environments, cids }
  })

  return body
}

export interface IProjectsControllerListParams {
  tenantId: number
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type ProjectsControllerListFn = (params: IProjectsControllerListParams) => Promise<types.IIProjectListResult>

export const projectsControllerList: ProjectsControllerListFn = async ({
  tenantId,
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy }
  })

  return body
}

export interface IProjectsControllerCreateParams {
  tenantId: number
  payload: types.IIPlayLoadInfo
}

type ProjectsControllerCreateFn = (params: IProjectsControllerCreateParams) => Promise<types.IIESProjectDetailResponse>

export const projectsControllerCreate: ProjectsControllerCreateFn = async ({ tenantId, payload }) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects`,
    method: 'POST',
    payload
  })

  return body
}

export interface IProjectsControllerGetResourceQuotasParams {
  tenantId: number
  projectName: string
}

type ProjectsControllerGetResourceQuotasFn = (
  params: IProjectsControllerGetResourceQuotasParams
) => Promise<types.IIProjectQuotasDto>

export const projectsControllerGetResourceQuotas: ProjectsControllerGetResourceQuotasFn = async ({
  tenantId,
  projectName
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/resourceQuotas`,
    method: 'GET'
  })

  return body
}

export interface IProjectsControllerUpdateResourceQuotasParams {
  tenantId: number
  projectName: string
  payload: types.IUpdateResourceQuotasBody
}

type ProjectsControllerUpdateResourceQuotasFn = (
  params: IProjectsControllerUpdateResourceQuotasParams
) => Promise<types.IICrdQuota[]>

export const projectsControllerUpdateResourceQuotas: ProjectsControllerUpdateResourceQuotasFn = async ({
  tenantId,
  projectName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/resourceQuotas`,
    method: 'PUT',
    payload
  })

  return body
}

export interface IProjectsControllerGetProjectMetricsParams {
  tenantId: number
  projectName: string
  env: string
  cluster: string
}

type ProjectsControllerGetProjectMetricsFn = (
  params: IProjectsControllerGetProjectMetricsParams
) => Promise<types.IIGetMetricsResult>

export const projectsControllerGetProjectMetrics: ProjectsControllerGetProjectMetricsFn = async ({
  tenantId,
  projectName,
  env,
  cluster
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/metrics`,
    method: 'GET',
    params: { env, cluster }
  })

  return body
}

export interface IProjectsControllerTransferProjectParams {
  tenantId: number
  projectName: string
  payload: types.IITransferProjectDto
}

type ProjectsControllerTransferProjectFn = (
  params: IProjectsControllerTransferProjectParams
) => Promise<types.IIESProjectDetailResponse>

export const projectsControllerTransferProject: ProjectsControllerTransferProjectFn = async ({
  tenantId,
  projectName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/transfer`,
    method: 'POST',
    payload
  })

  return body
}
