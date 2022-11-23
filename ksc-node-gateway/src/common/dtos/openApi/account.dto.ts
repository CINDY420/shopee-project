import { OpenApiListQuery } from '@/common/dtos/openApi/list.dto'

export class LoginPayload {
  googleAccessToken: string
}

export class LoginResponse {
  userId: string
  userName: string
  email: string
  accessToken: string
  avatar: string
}

class User {
  userId: string
  displayName: string
  email: string
  roleId: string
  roleName: string
  userType: string
}

export class ListGlobalUsersResponse {
  total: number
  items: User[]
}

export class OpenApiListGlobalUsersQuery extends OpenApiListQuery {}

class ProjectRole {
  tenantId?: string
  projectId?: string
  roleId: string
}

export class AddUserRoleBody {
  role: ProjectRole
}

export class AddUserRoleResponse {}

export class CreateUsersBody {
  emails: string[]
  role: ProjectRole
}
export class CreateUsersResponse {}
class UserRoles {
  tenantId?: string
  projectId?: string
  roleId: string
  roleName: string
}

export class GetUserResponse {
  userId: string
  displayName: string
  email: string
  roles: UserRoles[]
}

class RolePermission {
  resource: string
  label?: string
  action: string
}

export class GetRoleResponse {
  roleId: string
  roleName: string
  roleLevel: string
  permissions: RolePermission[]
}

class RawRole {
  roleId: string
  roleName: string
}

export class ListAllRolesResponse {
  total: number
  roles: RawRole[]
}

export class ListRoleApproversQuery {
  tenantId?: string
  projectId?: string
  roleId: string
}

export class RoleApprover {
  userId: string
  displayName: string
  email: string
  roleId: string
  roleName: string
}

export class ListRoleApproversResponse {
  total: number
  items: RoleApprover[]
}

export class DeleteUserRoleBody {
  role: {
    tenantId?: string
    projectId?: string
    roleId: string
  }
}
