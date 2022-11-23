/* eslint-disable */
import { HTTPFetch as fetch } from 'src/helpers/fetch'
import * as types from '../models'

export interface IQuotaController_listTenantsQuotaParams {
  azKey: string
  segmentKey: string
  filterBy?: string
  searchBy?: string
}

type QuotaController_listTenantsQuotaFn = (
  params: IQuotaController_listTenantsQuotaParams,
  extra?: any
) => Promise<types.IListTenantsQuotaResponse>

export const quotaController_listTenantsQuota: QuotaController_listTenantsQuotaFn = async (
  { azKey, segmentKey, filterBy, searchBy },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/quota/azs/${azKey}/segments/${segmentKey}/tenants`,
      method: 'GET',
      params: { filterBy, searchBy }
    },
    extra
  )

  return body
}

export interface IQuotaController_updateTenantsQuotaParams {
  azKey: string
  segmentKey: string
  payload: types.IUpdateTenantsQuotaBody
}

type QuotaController_updateTenantsQuotaFn = (
  params: IQuotaController_updateTenantsQuotaParams,
  extra?: any
) => Promise<types.IIV2OperationResponse>

export const quotaController_updateTenantsQuota: QuotaController_updateTenantsQuotaFn = async (
  { azKey, segmentKey, payload },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/quota/azs/${azKey}/segments/${segmentKey}/tenants`,
      method: 'PUT',
      payload
    },
    extra
  )

  return body
}

export interface IQuotaController_listTenantsQuotableEnvsParams {
  azKey: string
  segmentKey: string
}

type QuotaController_listTenantsQuotableEnvsFn = (
  params: IQuotaController_listTenantsQuotableEnvsParams,
  extra?: any
) => Promise<types.IListTenantsQuotableEnvsResponse>

export const quotaController_listTenantsQuotableEnvs: QuotaController_listTenantsQuotableEnvsFn =
  async ({ azKey, segmentKey }, extra) => {
    const body = await fetch(
      {
        resource: `ecpadmin/quota/azs/${azKey}/segments/${segmentKey}/tenants/quotableEnvs`,
        method: 'GET'
      },
      extra
    )

    return body
  }

export interface IQuotaController_getSegmentQuotaParams {
  azKey: string
  segmentKey: string
  env: string
}

type QuotaController_getSegmentQuotaFn = (
  params: IQuotaController_getSegmentQuotaParams,
  extra?: any
) => Promise<types.IGetSegmentQuotaResponse>

export const quotaController_getSegmentQuota: QuotaController_getSegmentQuotaFn = async (
  { azKey, segmentKey, env },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/quota/azs/${azKey}/segments/${segmentKey}`,
      method: 'GET',
      params: { env }
    },
    extra
  )

  return body
}

export interface IQuotaController_updateSegmentQuotaParams {
  azKey: string
  segmentKey: string
  payload: types.IUpdateSegmentQuotaBody
}

type QuotaController_updateSegmentQuotaFn = (
  params: IQuotaController_updateSegmentQuotaParams,
  extra?: any
) => Promise<types.IIV2OperationResponse>

export const quotaController_updateSegmentQuota: QuotaController_updateSegmentQuotaFn = async (
  { azKey, segmentKey, payload },
  extra
) => {
  const body = await fetch(
    {
      resource: `ecpadmin/quota/azs/${azKey}/segments/${segmentKey}`,
      method: 'PUT',
      payload
    },
    extra
  )

  return body
}

export interface IQuotaController_switchSegmentEnvQuotaParams {
  env: string
  azKey: string
  segmentKey: string
  payload: types.ISwitchQuotaBody
}

type QuotaController_switchSegmentEnvQuotaFn = (
  params: IQuotaController_switchSegmentEnvQuotaParams,
  extra?: any
) => Promise<types.IIV2OperationResponse>

export const quotaController_switchSegmentEnvQuota: QuotaController_switchSegmentEnvQuotaFn =
  async ({ env, azKey, segmentKey, payload }, extra) => {
    const body = await fetch(
      {
        resource: `ecpadmin/quota/azs/${azKey}/segments/${segmentKey}/envs/${env}:switch`,
        method: 'PUT',
        payload
      },
      extra
    )

    return body
  }
