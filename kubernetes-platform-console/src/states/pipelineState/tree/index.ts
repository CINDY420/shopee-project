import { atom } from 'recoil'

import { ITenantList } from 'api/types/tenant/tenant'

export const tenantTree = atom<ITenantList>({
  key: 'tenantTree',
  default: []
})
