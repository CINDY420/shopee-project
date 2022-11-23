import { IsNotEmpty } from 'class-validator'
import { ListQuery } from '@/common/dtos/list.dto'
import { GetUserResponse } from '@/common/dtos/openApi/account.dto'

export class ListGlobalUsersQuery extends ListQuery {}

export class GetUserDetailParams {
  @IsNotEmpty()
  userId: string
}

export class GetUserDetailResponse extends GetUserResponse {
  permissions: Record<string, string[]>
}

export class ListTenantUsersQuery extends ListQuery {}

export class ListTenantUsersParams {
  @IsNotEmpty()
  tenantId: string
}

export class ListProjectUsersParams extends ListTenantUsersParams {
  @IsNotEmpty()
  projectId: string
}

export class ListProjectUsersQuery extends ListQuery {}

export class DeleteUserRoleParams {
  userId: string
}
