import { EXECUTE_TASK_ACTION } from '@/features/ticket/dto/shopee-ticket-center/execute-task.dto'
import {
  ELASTIC_TICKET_STAGE,
  TICKET_STAGE,
  TICKET_STATUS,
  TICKET_TYPE,
} from '@/features/ticket/dto/ticket-service/ticket.model'

export const ES_TICKET_STATUS_MAP = {
  [TICKET_STATUS.OPEN]: [ELASTIC_TICKET_STAGE.PENDING],
  [TICKET_STATUS.CLOSED]: [ELASTIC_TICKET_STAGE.CANCELED, ELASTIC_TICKET_STAGE.REJECTED, ELASTIC_TICKET_STAGE.APPROVED],
}

export const ES_TICKET_STAGE_MAP = {
  [ELASTIC_TICKET_STAGE.PENDING]: TICKET_STAGE.PENDING,
  [ELASTIC_TICKET_STAGE.CANCELED]: TICKET_STAGE.CANCELED,
  [ELASTIC_TICKET_STAGE.APPROVED]: TICKET_STAGE.APPROVED,
  [ELASTIC_TICKET_STAGE.REJECTED]: TICKET_STAGE.REJECTED,
}

export const TICKET_EXECUTION_EMAIL_SUBJECT = '申请 kubernetes platform 权限审批结果[%s]'

export const TICKET_EXECUTION_EMAIL_CONTENT = {
  [TICKET_TYPE.ADD_ROLE]: `Hi, 您申请了 kubernetes platform add role, Tenant: %s, permissionGroup: %s，审批结果为[%s],请访问 https://%s 查看详情`,
  [TICKET_TYPE.CHANGE_ROLE]: `Hi, 您申请了 kubernetes platform change role, Tenant: %s, project: %s，审批结果为[%s],请访问 https://%s 查看详情`,
  [TICKET_TYPE.TERMINAL]: `Hi, 您申请了 kubernetes platform terminal requests, Tenant: %s, project: %s，审批结果为[%s],请访问 https://%s 查看详情`,
  [TICKET_TYPE.DEPLOYMENT_SCALE]: '',
}

export const TICKET_STARTER_DETAIL_URL = 'ticketsCenter/myRequests/ticketDetail'
export const TICKET_APPROVAL_DETAIL_URL = 'ticketsCenter/pendingMyAction/ticketDetail'

export const ES_TICKET_EXECUTE_TASK_ACTION_MAP = {
  [EXECUTE_TASK_ACTION.APPROVAL]: 'APPROVED',
  [EXECUTE_TASK_ACTION.REJECT]: 'REJECTED',
}

export const ES_TICKET_STATUS_CANCELED = 'CANCELLED'
