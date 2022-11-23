import { PERMISSION_GROUP } from 'constants/rbacActions'

export interface IPlatform {
  id: string
  name: string
  permissionGroup: PERMISSION_GROUP
}

export interface IPlatformList {
  platforms: IPlatform[]
  totalCount: number
}

export interface IAddPlatformAdminUser {
  emails: string[]
  permissionGroupId: number
}
