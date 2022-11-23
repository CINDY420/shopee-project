import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { AUTH_STATUS, AUTH_TYPE } from 'common/constants/auth'
import { RequestDetailResponseDto } from 'requests/dto/requests.dto'
import { IApprover } from 'common/interfaces/authService.interface'

export class RoleApplyRequestBodyDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  tenantId: number

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  permissionGroupId: number

  @ApiProperty({ type: String })
  purpose?: string
}

export class RoleApplyTenantUserBodyDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  tenantId: number

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  permissionGroupId: number
}

export class RoleApplyPlatformAdminBodyDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  purpose: string

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  permissionGroupId: number
}

export class IsRoleRequestPendingResponseDto {
  @ApiProperty({ type: Boolean })
  isRoleRequestPending: boolean
}

export interface IAccessRequestDetail extends RequestDetailResponseDto {
  id: string
}

export interface IInitialRequestPendingState {
  status: AUTH_STATUS
  ticketId: string
  approver: string
}

export interface INewTicketApplication {
  type: AUTH_TYPE
  applicantId: number
  tenant: number
  permissionGroup: number
  purpose?: string
}

export class IApplyResponse {
  @ApiProperty({ type: String })
  tenantName: string

  @ApiProperty({ type: Number })
  tenantId: number

  @ApiProperty({ type: String })
  permissionGroupName: string

  @ApiProperty({ type: Number })
  permissionGroupId: number

  @ApiProperty({ type: String })
  ticketId: string

  @ApiProperty({ type: [IApprover] })
  approverList: IApprover[]
}

export class ILatestNewUserTicket {
  @ApiProperty({ type: String })
  approver: string

  @ApiProperty({ type: String })
  status: string

  @ApiProperty({ type: String })
  ticketId: string
}

class IRoles {
  @ApiProperty({ type: Number })
  tenantId: number

  @ApiProperty({ type: String })
  tenantName: string

  @ApiProperty({ type: Number })
  roleId: number

  @ApiProperty({ type: String })
  roleName: string
}

export class IRoleBinding {
  @ApiProperty({ type: Number })
  totalCount: number

  @ApiProperty({ type: [IRoles] })
  roles: IRoles[]
}

class IRole {
  @ApiProperty({ type: Number })
  id: number

  @ApiProperty({ type: String })
  name: string
}

class ITenantRole {
  @ApiProperty({ type: Number })
  tenantId: number

  @ApiProperty({ type: String })
  tenantName: number

  @ApiProperty({ type: IRole })
  roles: IRole[]
}

export class ITenantRoles {
  @ApiProperty({ type: Number })
  totalCount: number

  @ApiProperty({ type: [ITenantRole] })
  tenantsRoles: ITenantRole[]
}

export class IPlatformRoles {
  @ApiProperty({ type: Number })
  totalCount: number

  @ApiProperty({ type: [IRole] })
  roles: IRole[]
}

export class IChangeRoleApplyRequestBodyDto {
  @ApiProperty({ type: [RoleApplyRequestBodyDto] })
  roles: RoleApplyRequestBodyDto[]
}

export class IChangeRoleApplyResponse {
  @ApiProperty({ type: [IApplyResponse] })
  tickets: IApplyResponse[]
}
