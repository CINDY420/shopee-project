import fetch from 'helpers/fetchV1'
import * as types from '../models'

export interface IProjectControllerListProjectParams {
  tenantId: string
  offset?: string
  limit?: string
  orderBy?: string
  filterBy?: string
  searchBy?: string
}

type ProjectControllerListProjectFn = (
  params: IProjectControllerListProjectParams
) => Promise<types.IListProjectResponse>

export const projectControllerListProject: ProjectControllerListProjectFn = async ({
  tenantId,
  offset,
  limit,
  orderBy,
  filterBy,
  searchBy
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects`,
    method: 'GET',
    params: { offset, limit, orderBy, filterBy, searchBy }
  })

  return body
}

export interface IProjectControllerCreateProjectParams {
  tenantId: string
  payload: types.ICreateProjectBody
}

type ProjectControllerCreateProjectFn = (params: IProjectControllerCreateProjectParams) => Promise<any>

export const projectControllerCreateProject: ProjectControllerCreateProjectFn = async ({ tenantId, payload }) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects`,
    method: 'POST',
    payload
  })

  return body
}

export interface IProjectControllerMoveProjectParams {
  tenantId: string
  projectName: string
  payload: types.IMoveProjectBody
}

type ProjectControllerMoveProjectFn = (params: IProjectControllerMoveProjectParams) => Promise<any>

export const projectControllerMoveProject: ProjectControllerMoveProjectFn = async ({
  tenantId,
  projectName,
  payload
}) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}/move`,
    method: 'POST',
    payload
  })

  return body
}

export interface IProjectControllerGetDetailParams {
  tenantId: number
  projectName: string
}

type ProjectControllerGetDetailFn = (params: IProjectControllerGetDetailParams) => Promise<types.IGetProjectResponse>

export const projectControllerGetDetail: ProjectControllerGetDetailFn = async ({ tenantId, projectName }) => {
  const body = await fetch({
    resource: `v1/tenants/${tenantId}/projects/${projectName}`,
    method: 'GET'
  })

  return body
}
