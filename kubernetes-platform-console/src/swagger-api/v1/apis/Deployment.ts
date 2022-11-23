import fetch from 'helpers/fetchV1'
import * as types from '../models'

export interface IDeploymentControllerListTasksParams {
  tenantId: string
  projectName: string
  appName: string
  sduName: string
  offset?: string
  limit?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type DeploymentControllerListTasksFn = (
  params: IDeploymentControllerListTasksParams
) => Promise<types.IListTasksResponse>

export const deploymentControllerListTasks: DeploymentControllerListTasksFn = async ({
  tenantId,
  projectName,
  appName,
  sduName,
  offset,
  limit,
  orderBy,
  filterBy,
  searchBy
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/applications/${appName}/sdus/${sduName}/tasks`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, searchBy }
  })

  return body
}

export interface IDeploymentControllerListDeploymentHistoryParams {
  tenantId: string
  projectName: string
  appName: string
  sduName: string
  offset?: string
  limit?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type DeploymentControllerListDeploymentHistoryFn = (
  params: IDeploymentControllerListDeploymentHistoryParams
) => Promise<types.IListDeploymentHistoryResponse>

export const deploymentControllerListDeploymentHistory: DeploymentControllerListDeploymentHistoryFn = async ({
  tenantId,
  projectName,
  appName,
  sduName,
  offset,
  limit,
  orderBy,
  filterBy,
  searchBy
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/applications/${appName}/sdus/${sduName}/history`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, searchBy }
  })

  return body
}

export interface IDeploymentControllerGetDeploymentParams {
  tenantId: string
  projectName: string
  appName: string
  deploymentName: string
  clusterName: string
  cid: string
  env: string
  phase: string
}

type DeploymentControllerGetDeploymentFn = (
  params: IDeploymentControllerGetDeploymentParams
) => Promise<types.IGetDeploymentResponse>

export const deploymentControllerGetDeployment: DeploymentControllerGetDeploymentFn = async ({
  tenantId,
  projectName,
  appName,
  deploymentName,
  clusterName,
  cid,
  env,
  phase
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/applications/${appName}/deployments/${deploymentName}`,
    method: 'GET',
    params: { clusterName, cid, env, phase }
  })

  return body
}
