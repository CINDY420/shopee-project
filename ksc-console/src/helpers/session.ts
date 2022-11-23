import { parse } from 'query-string'

import history from 'helpers/history'
import { REDIRECT_QUERY_KEY, LOGIN, DEFAULT_ROUTE, ACCESS_APPLY } from 'constants/routes/route'
import { ICreateSessionResponse, IUserRoles } from 'swagger-api/models'

export interface IUserInfo extends ICreateSessionResponse {
  permissions: Record<string, string[]>
  roles: IUserRoles[]
}

/**
 * Use localStorage to store data with key '__session'
 * @param session JSON object
 */
export const setSession = (session: IUserInfo) =>
  window.localStorage.setItem('__session', JSON.stringify(session))

/**
 * Remove the data with key '__session' in localStorage
 */
export const removeSession = () => window.localStorage.removeItem('__session')

/**
 * Get the data with key '__session' in localStorage
 */
export const getSession = (): IUserInfo =>
  JSON.parse(window.localStorage.getItem('__session') || '{}')

/**
 * Remove authorization information
 */
export const redirectToLoginPage = () => {
  const { pathname, search } = history.location
  const redirect = parse(search)[REDIRECT_QUERY_KEY]
  if (pathname !== LOGIN) {
    removeSession()
    window.location.replace(
      `${LOGIN}?${REDIRECT_QUERY_KEY}=${encodeURIComponent((redirect as string) || pathname)}`,
    )
  }
}

/**
 * Access authorization information
 */
export const loginSuccessRedirect = () => {
  const { pathname, search } = history.location
  const redirect = parse(search)[REDIRECT_QUERY_KEY]
  if (pathname === LOGIN) window.location.replace((redirect as string) || DEFAULT_ROUTE)
}

/**
 * New User access apply redirect
 */
export const accessApplyRedirect = () => {
  history.replace(ACCESS_APPLY)
}

export const defaultRouteRedirect = () => {
  history.replace(DEFAULT_ROUTE)
}
