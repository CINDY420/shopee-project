/* eslint-disable */
import { HTTPFetch as fetch } from 'src/helpers/fetch'
import * as types from '../models'

type TenantController_listTenantsFn = (extra?: any) => Promise<types.IListTenantResponse>

export const tenantController_listTenants: TenantController_listTenantsFn = async (extra?: any) => {
  const body = await fetch(
    {
      resource: 'ecpadmin/tenants',
      method: 'GET'
    },
    extra
  )

  return body
}
