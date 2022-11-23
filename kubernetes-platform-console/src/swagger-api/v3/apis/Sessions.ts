import fetch from 'helpers/fetch'
import * as types from '../models'

export interface ISessionsControllerCreateParams {
  payload: types.ICreateSessionDto
}

type SessionsControllerCreateFn = (params: ISessionsControllerCreateParams) => Promise<any>

export const sessionsControllerCreate: SessionsControllerCreateFn = async ({ payload }) => {
  const body = await fetch({
    resource: 'v3/sessions',
    method: 'POST',
    payload
  })

  return body
}

type SessionsControllerFindOneFn = () => Promise<any>

export const sessionsControllerFindOne: SessionsControllerFindOneFn = async () => {
  const body = await fetch({
    resource: 'v3/sessions',
    method: 'GET'
  })

  return body
}

type SessionsControllerRemoveFn = () => Promise<any>

export const sessionsControllerRemove: SessionsControllerRemoveFn = async () => {
  const body = await fetch({
    resource: 'v3/sessions',
    method: 'DELETE'
  })

  return body
}
