import fetch from 'helpers/fetch'
import * as types from '../models'

export interface IServicesControllerGetServiceListParams {
  tenantId: number
  project: string
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

type ServicesControllerGetServiceListFn = (params: IServicesControllerGetServiceListParams) => Promise<any>

export const servicesControllerGetServiceList: ServicesControllerGetServiceListFn = async ({
  tenantId,
  project,
  offset,
  limit,
  orderBy,
  filterBy
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${project}/services`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy }
  })

  return body
}

export interface IServicesControllerCreateServiceParams {
  tenantId: number
  project: string
  payload: types.IICreateServicePlayLoad
}

type ServicesControllerCreateServiceFn = (params: IServicesControllerCreateServiceParams) => Promise<any>

export const servicesControllerCreateService: ServicesControllerCreateServiceFn = async ({
  tenantId,
  project,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${project}/services`,
    method: 'POST',
    payload
  })

  return body
}

export interface IServicesControllerUpdateServiceParams {
  tenantId: number
  project: string
  svc: string
  payload: types.IIUpdateServicePlayLoad
}

type ServicesControllerUpdateServiceFn = (params: IServicesControllerUpdateServiceParams) => Promise<any>

export const servicesControllerUpdateService: ServicesControllerUpdateServiceFn = async ({
  tenantId,
  project,
  svc,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${project}/services/${svc}`,
    method: 'PUT',
    payload
  })

  return body
}

export interface IServicesControllerDeleteServiceParams {
  tenantId: number
  project: string
  svc: string
  cluster: string
}

type ServicesControllerDeleteServiceFn = (params: IServicesControllerDeleteServiceParams) => Promise<any>

export const servicesControllerDeleteService: ServicesControllerDeleteServiceFn = async ({
  tenantId,
  project,
  svc,
  cluster
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${project}/services/${svc}`,
    method: 'DELETE',
    params: { cluster }
  })

  return body
}

export interface IServicesControllerGetServiceDetailParams {
  tenantId: number
  projectName: string
  serviceName: string
  cluster: string
}

type ServicesControllerGetServiceDetailFn = (params: IServicesControllerGetServiceDetailParams) => Promise<any>

export const servicesControllerGetServiceDetail: ServicesControllerGetServiceDetailFn = async ({
  tenantId,
  projectName,
  serviceName,
  cluster
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/services/${serviceName}`,
    method: 'GET',
    params: { cluster }
  })

  return body
}
