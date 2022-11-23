import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RequestDetailResponseDto {
  @ApiProperty({ type: String })
  group: string

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: String })
  email: string

  @ApiProperty({ type: String })
  createtime: string

  @ApiProperty({ type: String })
  status: string

  @ApiProperty({ type: String })
  type?: string

  @ApiProperty({ type: String })
  role?: string

  @ApiProperty({ type: String })
  realGroup?: string

  @ApiProperty({ type: String })
  requireres?: string

  @ApiProperty({ type: String })
  approver?: string

  @ApiProperty({ type: String })
  reason?: string

  @ApiProperty({ type: String })
  updatetime?: string
}

export class RequestListItem extends RequestDetailResponseDto {
  @ApiProperty({ type: String })
  id: string
}

export class RequestListResponseDto {
  @ApiProperty({ type: Number })
  totalCount: number

  @ApiProperty({ type: [RequestListItem] })
  items: RequestListItem[]
}

export class LatestAccessApplyRecordParam {
  @ApiProperty()
  @IsNotEmpty()
  tenantId: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  projectName: string
}

export class LatestAccessApplyRecordResponse {
  @ApiProperty()
  approver: string

  @ApiProperty()
  createtime: string

  @ApiProperty()
  email: string

  @ApiProperty()
  group: string

  @ApiProperty()
  name: string

  @ApiProperty()
  reason: string

  @ApiProperty()
  requireres: string

  @ApiProperty()
  status: string

  @ApiProperty()
  updatetime: string
}

export class IESTicket {
  @ApiProperty()
  id: string

  @ApiProperty()
  tenant: number

  @ApiProperty()
  type: string

  @ApiProperty()
  permissionGroup?: number

  @ApiProperty()
  applicant: number

  @ApiProperty()
  status: string

  @ApiProperty()
  approver?: number

  @ApiProperty()
  project?: string

  @ApiProperty()
  purpose?: string

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  updatedAt: string
}
