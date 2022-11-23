import { PERMISSION_SCOPE, RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'

export interface IAccessControlProps {
  scope: PERMISSION_SCOPE
  resources: RESOURCE_TYPE[]
  tenantId?: number
}

export type IAccessControlResponse = Record<RESOURCE_TYPE, RESOURCE_ACTION[]>
