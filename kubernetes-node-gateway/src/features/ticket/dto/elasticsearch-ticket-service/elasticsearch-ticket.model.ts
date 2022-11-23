import { ELASTIC_TICKET_STAGE, TICKET_TYPE } from '@/features/ticket/dto/ticket-service/ticket.model'

export class ElasticsearchTicketDetail {
  type: TICKET_TYPE
  applicantName: string
  applicantEmail: string
  applicantId: number
  tenantName: string
  tenantId: number
  permissionGroupName: string
  permissionGroupId: number
  appliedTime: string
  status: string
  project: string
  purpose: string
  approvedTime: string
  cancelledTime: string
  approver: string
  approverList: ElasticsearchTicketApprover[]
}

export class ElasticsearchTicketApprover {
  userId: number
  name: string
  email: string
}

export class ElasticsearchTicket {
  id: string
  displayId: string
  tenant: number
  type: TICKET_TYPE
  permissionGroup?: number
  applicant: number
  status: ELASTIC_TICKET_STAGE
  approver?: number
  project?: string
  purpose?: string
  createdAt: string
  updatedAt: string
}
