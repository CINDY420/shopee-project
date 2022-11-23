import { parse } from 'query-string'

import history from 'helpers/history'
import { REDIRECT_QUERY_KEY, LOGIN, DEFAULT_ROUTE, ACCESS_REQUEST } from 'constants/routes/routes'
import { ForbiddenType } from 'constants/accessRequest'
import { RBACActionType } from 'constants/rbacActions'

interface IUserInfo {
  name: string
  avatar: string
  email: string
  userId: number
}

/**
 * Use localStorage to store data with key '__session'
 * @param session JSON object
 */
export const setSession = (session: IUserInfo) => window.localStorage.setItem('__session', JSON.stringify(session))

/**
 * Remove the data with key '__session' in localStorage
 */
export const removeSession = () => window.localStorage.removeItem('__session')

/**
 * Get the data with key '__session' in localStorage
 */
export const getSession = (): IUserInfo => JSON.parse(window.localStorage.getItem('__session') || '{}')

/**
 * Remove authorization information
 */
export const unauthorizedCb = () => {
  const { pathname, search } = history.location
  const redirect = parse(search)[REDIRECT_QUERY_KEY]
  if (pathname !== LOGIN) {
    removeSession()
    history.replace(`${LOGIN}?${REDIRECT_QUERY_KEY}=${encodeURIComponent((redirect as string) || pathname)}`)
  }
}

/**
 * Access authorization information
 */
export const authorizedCb = () => {
  const { pathname, search } = history.location
  const redirect = parse(search)[REDIRECT_QUERY_KEY]
  if (pathname === LOGIN) {
    history.replace((redirect as string) || DEFAULT_ROUTE)
  }
}

/**
 * Access request callbacks
 */

export const handleInitialAccessRequest = (accessRequestType: RBACActionType) => {
  const { pathname, search } = history.location
  let redirect
  if (search) {
    redirect = parse(search)[REDIRECT_QUERY_KEY]
  }
  // addQuery
  const redirectQuery = redirect ? `?${REDIRECT_QUERY_KEY}=${encodeURIComponent((redirect as string) || pathname)}` : ''

  if (pathname !== ACCESS_REQUEST || !search) {
    history.replace(`${ACCESS_REQUEST}${redirectQuery}`)
  }
}

/**
 * Handle request forbidden
 */
const forbiddenHandlersMap = {
  [ForbiddenType.NewUser]: () => handleInitialAccessRequest(RBACActionType.INITIAL_ACCESS)
}

export const forbiddenCb = (forbiddenType: ForbiddenType) => {
  const handleForbidden = forbiddenHandlersMap[forbiddenType]
  handleForbidden()
}
