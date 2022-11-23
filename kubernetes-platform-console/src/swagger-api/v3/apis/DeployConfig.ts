import fetch from 'helpers/fetch'
import * as types from '../models'

export interface IDeployConfigControllerGetDeployConfigParams {
  tenantId: number
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
    resource: `v3/tenants/${tenantId}/projects/${projectName}/applications/${appName}/deploy-config`,
    method: 'GET',
    params: { env }
  })

  return body
}

export interface IDeployConfigControllerUpdateDeployConfigParams {
  tenantId: number
  appName: string
  projectName: string
  payload: types.IUpdateDeployConfigRequestBody
}

type DeployConfigControllerUpdateDeployConfigFn = (
  params: IDeployConfigControllerUpdateDeployConfigParams
) => Promise<types.IUpdateDeployConfigResponse>

export const deployConfigControllerUpdateDeployConfig: DeployConfigControllerUpdateDeployConfigFn = async ({
  tenantId,
  appName,
  projectName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/projects/${projectName}/applications/${appName}/deploy-config`,
    method: 'POST',
    payload
  })

  return body
}
