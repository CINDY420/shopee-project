import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ITenant } from 'applications-management/groups/dto/group.dto'
import { ListQueryDto } from 'common/dtos/list.dto'
import { IRoleBind, IUser, IApprover } from 'common/interfaces/authService.interface'

export class IListTicketsQueryDto extends ListQueryDto {
  // @ApiProperty({ type: String })
  // statusType?: string
}

export enum STATUS_TYPE {
  All = 'All',
  Pending = 'Pending',
  Finished = 'Finished'
}

export class IListMyTickets extends ListQueryDto {
  @ApiProperty({ type: String })
  statusType?: STATUS_TYPE
}

export class ITicket {
  @ApiPropertyOptional()
  displayId?: string

  @ApiProperty()
  id: string

  @ApiProperty()
  tenant: ITenant

  @ApiProperty()
  type: string

  @ApiProperty()
  permissionGroup: IRoleBind

  @ApiProperty()
  applicant: IUser

  @ApiProperty()
  status: string

  @ApiProperty()
  approver: IUser

  @ApiProperty()
  project: string

  @ApiProperty()
  purpose: string

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  updatedAt: string
}

export class ApplyTerminalAccessBody {
  @ApiProperty()
  reason: string
}

export class IListTicketsResponse {
  @ApiProperty({ type: [ITicket] })
  tickets: ITicket[]

  @ApiProperty()
  totalCount: number
}

export class ITicketDetail {
  @ApiProperty({ type: String })
  type: string

  @ApiProperty()
  applicantName: string

  @ApiProperty()
  applicantId: number

  @ApiProperty()
  applicantEmail: string

  @ApiProperty()
  tenantName: string

  @ApiProperty()
  tenantId: number

  @ApiProperty()
  permissionGroupName: string

  @ApiProperty()
  permissionGroupId: number

  @ApiProperty()
  appliedTime: string

  @ApiProperty({ type: String })
  status: string

  @ApiProperty()
  project: string

  @ApiProperty()
  purpose: string

  @ApiProperty()
  approvedTime: string

  @ApiProperty()
  cancelledTime: string

  @ApiProperty()
  approver: string

  @ApiProperty({ type: [IApprover] })
  approverList: IApprover[]
}

export class IPostResponse {
  message: string
}

export class IMyTickets extends IListTicketsResponse {
  @ApiProperty()
  pendingCount: number

  @ApiProperty()
  finishedCount: number
}
