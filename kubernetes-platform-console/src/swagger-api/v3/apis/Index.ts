import fetch from 'helpers/fetch'
import * as types from '../models'

type AppControllerGetHelloFn = () => Promise<any>

export const appControllerGetHello: AppControllerGetHelloFn = async () => {
  const body = await fetch({
    resource: 'v3',
    method: 'GET'
  })

  return body
}

export interface IRbacControllerGetResourcePermissionsParams {
  scope: string
  resources: string[]
  tenantId?: number
}

type RbacControllerGetResourcePermissionsFn = (params: IRbacControllerGetResourcePermissionsParams) => Promise<any>

export const rbacControllerGetResourcePermissions: RbacControllerGetResourcePermissionsFn = async ({
  scope,
  resources,
  tenantId
}) => {
  const body = await fetch({
    resource: `v3/resource/${scope}/accessControl`,
    method: 'GET',
    params: { resources, tenantId }
  })

  return body
}

export interface IPrometheusControllerPostPerformanceParams {
  payload: types.IPerformanceBodyDto
}

type PrometheusControllerPostPerformanceFn = (params: IPrometheusControllerPostPerformanceParams) => Promise<any>

export const prometheusControllerPostPerformance: PrometheusControllerPostPerformanceFn = async ({ payload }) => {
  const body = await fetch({
    resource: 'v3/prometheus/performance',
    method: 'POST',
    payload
  })

  return body
}

type InspectorControllerInspectCPUFn = () => Promise<any>

export const inspectorControllerInspectCPU: InspectorControllerInspectCPUFn = async () => {
  const body = await fetch({
    resource: 'v3/inspector/cpu',
    method: 'GET'
  })

  return body
}

type InspectorControllerGetHeapdumpFn = () => Promise<any>

export const inspectorControllerGetHeapdump: InspectorControllerGetHeapdumpFn = async () => {
  const body = await fetch({
    resource: 'v3/inspector/heapdump',
    method: 'GET'
  })

  return body
}

type PolicyControllerCreatePolicyFn = () => Promise<any>

export const policyControllerCreatePolicy: PolicyControllerCreatePolicyFn = async () => {
  const body = await fetch({
    resource: 'v3/policy',
    method: 'POST'
  })

  return body
}

export interface IPolicyControllerGetPolicyParams {
  source: string
  role: number
  effectiveSourceId: string
}

type PolicyControllerGetPolicyFn = (params: IPolicyControllerGetPolicyParams) => Promise<any>

export const policyControllerGetPolicy: PolicyControllerGetPolicyFn = async ({ source, role, effectiveSourceId }) => {
  const body = await fetch({
    resource: 'v3/policy',
    method: 'GET',
    params: { source, role, effectiveSourceId }
  })

  return body
}

export interface IPolicyControllerGetPolicyListParams {
  size: number
  from: number
}

type PolicyControllerGetPolicyListFn = (params: IPolicyControllerGetPolicyListParams) => Promise<any>

export const policyControllerGetPolicyList: PolicyControllerGetPolicyListFn = async ({ size, from }) => {
  const body = await fetch({
    resource: 'v3/policy/list',
    method: 'GET',
    params: { size, from }
  })

  return body
}

export interface IPolicyControllerDelPolicyParams {
  id: string
}

type PolicyControllerDelPolicyFn = (params: IPolicyControllerDelPolicyParams) => Promise<any>

export const policyControllerDelPolicy: PolicyControllerDelPolicyFn = async ({ id }) => {
  const body = await fetch({
    resource: `v3/policy/${id}`,
    method: 'DELETE'
  })

  return body
}
