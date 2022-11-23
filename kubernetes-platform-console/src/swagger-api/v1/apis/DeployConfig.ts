import fetch from 'helpers/fetchV1'
import * as types from '../models'

export interface IDeployConfigControllerUpdateDeployConfigParams {
  tenantId: string
  appName: string
  projectName: string
  payload: types.IUpdateDeployConfigBodyDto
}

type DeployConfigControllerUpdateDeployConfigFn = (
  params: IDeployConfigControllerUpdateDeployConfigParams
) => Promise<any>

export const deployConfigControllerUpdateDeployConfig: DeployConfigControllerUpdateDeployConfigFn = async ({
  tenantId,
  appName,
  projectName,
  payload
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/applications/${appName}/deploy-config`,
    method: 'PUT',
    payload
  })

  return body
}

export interface IDeployConfigControllerGetDeployConfigParams {
  tenantId: string
  appName: string
  projectName: string
  env: string
}

type DeployConfigControllerGetDeployConfigFn = (
  params: IDeployConfigControllerGetDeployConfigParams
) => Promise<types.IGetDeployConfigResponse>

export const deployConfigControllerGetDeployConfig: DeployConfigControllerGetDeployConfigFn = async ({
  tenantId,
  appName,
  projectName,
  env
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/applications/${appName}/deploy-config`,
    method: 'GET',
    params: { env }
  })

  return body
}

export interface IDeployConfigControllerListAvailableZonesParams {
  tenantId: string
  appName: string
  projectName: string
  env: string
}

type DeployConfigControllerListAvailableZonesFn = (
  params: IDeployConfigControllerListAvailableZonesParams
) => Promise<types.IListAvailableZonesResponse>

export const deployConfigControllerListAvailableZones: DeployConfigControllerListAvailableZonesFn = async ({
  tenantId,
  appName,
  projectName,
  env
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/applications/${appName}/deploy-config/resources/available-zones`,
    method: 'GET',
    params: { env }
  })

  return body
}

export interface IDeployConfigControllerListComponentsParams {
  tenantId: string
  appName: string
  projectName: string
  env: string
}

type DeployConfigControllerListComponentsFn = (
  params: IDeployConfigControllerListComponentsParams
) => Promise<types.IListComponentResponse>

export const deployConfigControllerListComponents: DeployConfigControllerListComponentsFn = async ({
  tenantId,
  appName,
  projectName,
  env
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/applications/${appName}/deploy-config/resources/components`,
    method: 'GET',
    params: { env }
  })

  return body
}

export interface IDeployConfigControllerListExtraConfigsParams {
  tenantId: string
  appName: string
  projectName: string
}

type DeployConfigControllerListExtraConfigsFn = (
  params: IDeployConfigControllerListExtraConfigsParams
) => Promise<types.IListExtraConfigsResponse>

export const deployConfigControllerListExtraConfigs: DeployConfigControllerListExtraConfigsFn = async ({
  tenantId,
  appName,
  projectName
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/applications/${appName}/deploy-config/resources/extra-configs`,
    method: 'GET'
  })

  return body
}

export interface IDeployConfigControllerListDeployConfigEnvsParams {
  tenantId: string
  appName: string
  projectName: string
}

type DeployConfigControllerListDeployConfigEnvsFn = (
  params: IDeployConfigControllerListDeployConfigEnvsParams
) => Promise<types.IListDeployConfigEnvsResponse>

export const deployConfigControllerListDeployConfigEnvs: DeployConfigControllerListDeployConfigEnvsFn = async ({
  tenantId,
  appName,
  projectName
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/applications/${appName}/deploy-config/resources/deployConfigEnvs`,
    method: 'GET'
  })

  return body
}
