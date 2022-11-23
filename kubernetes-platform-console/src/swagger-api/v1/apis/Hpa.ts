import fetch from 'helpers/fetchV1'
import * as types from '../models'

export interface IHpaControllerCreateHpaParams {
  tenantId: string
  projectName: string
  appName: string
  payload: types.ICreateHpaBody
}

type HpaControllerCreateHpaFn = (params: IHpaControllerCreateHpaParams) => Promise<any>

export const hpaControllerCreateHpa: HpaControllerCreateHpaFn = async ({ tenantId, projectName, appName, payload }) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/apps/${appName}/hpa:create`,
    method: 'POST',
    payload
  })

  return body
}

export interface IHpaControllerUpdateHpaParams {
  tenantId: string
  projectName: string
  appName: string
  payload: types.IUpdateHpaBody
}

type HpaControllerUpdateHpaFn = (params: IHpaControllerUpdateHpaParams) => Promise<any>

export const hpaControllerUpdateHpa: HpaControllerUpdateHpaFn = async ({ tenantId, projectName, appName, payload }) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/apps/${appName}/hpa`,
    method: 'PATCH',
    payload
  })

  return body
}

export interface IHpaControllerDeleteHpaParams {
  tenantId: string
  projectName: string
  appName: string
  payload: types.IBatchEditHPARulesBody
}

type HpaControllerDeleteHpaFn = (params: IHpaControllerDeleteHpaParams) => Promise<{}>

export const hpaControllerDeleteHpa: HpaControllerDeleteHpaFn = async ({ tenantId, projectName, appName, payload }) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/apps/${appName}/hpa`,
    method: 'DELETE',
    payload
  })

  return body
}

export interface IHpaControllerGetHpaDetailParams {
  tenantId: string
  projectName: string
  appName: string
  az: string
  sdu: string
}

type HpaControllerGetHpaDetailFn = (params: IHpaControllerGetHpaDetailParams) => Promise<types.IGetHpaDetailResponse>

export const hpaControllerGetHpaDetail: HpaControllerGetHpaDetailFn = async ({
  tenantId,
  projectName,
  appName,
  az,
  sdu
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/apps/${appName}/hpa`,
    method: 'GET',
    params: { az, sdu }
  })

  return body
}

export interface IHpaControllerEnableHpaParams {
  tenantId: string
  projectName: string
  appName: string
  payload: types.IBatchEditHPARulesBody
}

type HpaControllerEnableHpaFn = (params: IHpaControllerEnableHpaParams) => Promise<{}>

export const hpaControllerEnableHpa: HpaControllerEnableHpaFn = async ({ tenantId, projectName, appName, payload }) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/apps/${appName}/hpa:enable`,
    method: 'POST',
    payload
  })

  return body
}

export interface IHpaControllerDisableHpaParams {
  tenantId: string
  projectName: string
  appName: string
  payload: types.IBatchEditHPARulesBody
}

type HpaControllerDisableHpaFn = (params: IHpaControllerDisableHpaParams) => Promise<{}>

export const hpaControllerDisableHpa: HpaControllerDisableHpaFn = async ({
  tenantId,
  projectName,
  appName,
  payload
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/apps/${appName}/hpa:disable`,
    method: 'POST',
    payload
  })

  return body
}

export interface IHpaControllerListHPARulesParams {
  tenantId: string
  projectName: string
  appName: string
  offset?: string
  limit?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type HpaControllerListHPARulesFn = (params: IHpaControllerListHPARulesParams) => Promise<types.IListHPARulesResponse>

export const hpaControllerListHPARules: HpaControllerListHPARulesFn = async ({
  tenantId,
  projectName,
  appName,
  offset,
  limit,
  orderBy,
  filterBy,
  searchBy
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/apps/${appName}/hpas`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, searchBy }
  })

  return body
}

export interface IHpaControllerBatchCopyHpaParams {
  tenantId: string
  projectName: string
  appName: string
  payload: types.IBatchCopyHpaBody
}

type HpaControllerBatchCopyHpaFn = (params: IHpaControllerBatchCopyHpaParams) => Promise<types.IBatchCopyHpaResponse[]>

export const hpaControllerBatchCopyHpa: HpaControllerBatchCopyHpaFn = async ({
  tenantId,
  projectName,
  appName,
  payload
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/apps/${appName}/hpas:copy`,
    method: 'POST',
    payload
  })

  return body
}

export interface IHpaControllerGetHpaDefaultConfigParams {
  tenantId: string
  projectName: string
  appName: string
  az: string
  sdu: string
}

type HpaControllerGetHpaDefaultConfigFn = (
  params: IHpaControllerGetHpaDefaultConfigParams
) => Promise<types.IGetHpaDefaultConfigResponse>

export const hpaControllerGetHpaDefaultConfig: HpaControllerGetHpaDefaultConfigFn = async ({
  tenantId,
  projectName,
  appName,
  az,
  sdu
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/apps/${appName}/hpa/default`,
    method: 'GET',
    params: { az, sdu }
  })

  return body
}
