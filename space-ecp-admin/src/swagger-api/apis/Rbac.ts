/* eslint-disable */
import { HTTPFetch as fetch } from 'src/helpers/fetch'
import * as types from '../models'

type RbacController_accessControlFn = (extra?: any) => Promise<types.IAccessControlResponse>

export const rbacController_accessControl: RbacController_accessControlFn = async (extra?: any) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/rbac/accessControl',
      method: 'GET'
    },
    extra
  )

  return body
}
