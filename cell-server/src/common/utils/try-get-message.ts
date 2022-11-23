import { get } from 'lodash'

export function tryGetMessage(body: unknown, messageKey = 'message') {
  // is safe to access 'message' of body
  return get(body, messageKey, 'unknown error')
}
