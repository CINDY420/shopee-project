import fetch from 'helpers/fetch'
import * as types from '../models'

/**
 * Get the last release freeze.
 */
export interface IFreezesControllerGetLastReleaseFreezeParams {
  env: string
}

/**
 * Get the last release freeze.
 */
type FreezesControllerGetLastReleaseFreezeFn = (
  params: IFreezesControllerGetLastReleaseFreezeParams
) => Promise<types.IGetLastReleaseFreezeResponseDto>

/**
 * Get the last release freeze.
 */
export const freezesControllerGetLastReleaseFreeze: FreezesControllerGetLastReleaseFreezeFn = async ({ env }) => {
  const body = await fetch({
    resource: 'v3/getLastReleaseFreeze',
    method: 'GET',
    params: { env }
  })

  return body
}

/**
 * Get release freeze list.
 */
export interface IFreezesControllerListReleaseFreezesParams {
  offset?: number
  limit?: number
  status?: string
}

/**
 * Get release freeze list.
 */
type FreezesControllerListReleaseFreezesFn = (
  params: IFreezesControllerListReleaseFreezesParams
) => Promise<types.IListReleaseFreezesResponseDto>

/**
 * Get release freeze list.
 */
export const freezesControllerListReleaseFreezes: FreezesControllerListReleaseFreezesFn = async ({
  offset,
  limit,
  status
}) => {
  const body = await fetch({
    resource: 'v3/releaseFreezes',
    method: 'GET',
    params: { offset, limit, status }
  })

  return body
}

/**
 * Create a new release freeze.
 */
export interface IFreezesControllerCreateReleaseFreezeParams {
  payload: types.ICreateReleaseFreezeBodyDto
}

/**
 * Create a new release freeze.
 */
type FreezesControllerCreateReleaseFreezeFn = (params: IFreezesControllerCreateReleaseFreezeParams) => Promise<{}>

/**
 * Create a new release freeze.
 */
export const freezesControllerCreateReleaseFreeze: FreezesControllerCreateReleaseFreezeFn = async ({ payload }) => {
  const body = await fetch({
    resource: 'v3/releaseFreezes',
    method: 'POST',
    payload
  })

  return body
}

/**
 * Edit a release freeze
 */
export interface IFreezesControllerUpdateReleaseFreezeParams {
  releaseFreezeId: string
  payload: types.IUpdateReleaseFreezeBodyDto
}

/**
 * Edit a release freeze
 */
type FreezesControllerUpdateReleaseFreezeFn = (params: IFreezesControllerUpdateReleaseFreezeParams) => Promise<{}>

/**
 * Edit a release freeze
 */
export const freezesControllerUpdateReleaseFreeze: FreezesControllerUpdateReleaseFreezeFn = async ({
  releaseFreezeId,
  payload
}) => {
  const body = await fetch({
    resource: `v3/releaseFreezes/${releaseFreezeId}`,
    method: 'PUT',
    payload
  })

  return body
}

/**
 * Get release freeze.
 */
export interface IFreezesControllerGetReleaseFreezeParams {
  releaseFreezeId: string
}

/**
 * Get release freeze.
 */
type FreezesControllerGetReleaseFreezeFn = (
  params: IFreezesControllerGetReleaseFreezeParams
) => Promise<types.IReleaseFreezeItemDto>

/**
 * Get release freeze.
 */
export const freezesControllerGetReleaseFreeze: FreezesControllerGetReleaseFreezeFn = async ({ releaseFreezeId }) => {
  const body = await fetch({
    resource: `v3/releaseFreezes/${releaseFreezeId}`,
    method: 'GET'
  })

  return body
}

/**
 * Stop a release freeze
 */
export interface IFreezesControllerStopReleaseFreezeParams {
  releaseFreezeId: string
}

/**
 * Stop a release freeze
 */
type FreezesControllerStopReleaseFreezeFn = (params: IFreezesControllerStopReleaseFreezeParams) => Promise<{}>

/**
 * Stop a release freeze
 */
export const freezesControllerStopReleaseFreeze: FreezesControllerStopReleaseFreezeFn = async ({ releaseFreezeId }) => {
  const body = await fetch({
    resource: `v3/releaseFreezes/${releaseFreezeId}/stop`,
    method: 'POST'
  })

  return body
}
