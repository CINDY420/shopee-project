import { SRE_TICKET_EMERGENCY_NAME, SRE_TICKET_STATUS } from '@/common/constants/sre-ticket'

export class SreAddRoleBody {
  userId: string
  tenantId: string
  projectId?: string
  roleId: string
}

export class CreateSreAddRoleTicketFEBody extends SreAddRoleBody {
  reason: string
}

export class CreateSreAddRoleTicketBody {
  order_title: string // 工单标题
  describe: string // 申请理由
  label_id: number // 根据申请人是租户管理员/租户成员、项目管理员、项目成员分别设为 101、102、103
  env_id: number // 环境id，sre工单系统提供
  reporter_email: string // 申请人
  assigner_email: string[] // 工单审批人列表
  schema_value: SreAddRoleBody // 审批通过时调用接口的payload
}

export class CreateSreAddRoleTicketBodyWrapper extends CreateSreAddRoleTicketBody {
  department: number // 固定值139。部门id，sre工单系统提供
  emergency_name: SRE_TICKET_EMERGENCY_NAME // 固定值'Normal'。 可选Normal | Urgent | Very Urgent。sre工单系统提供
  order_type: number // 固定值5。来源工单类型id，sre工单系统提供
}

export class ListSreTicketQuery {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  reporter__email: string // sre工单系统需要的字段
  status?: SRE_TICKET_STATUS
}

export class SreTicket {
  status: SRE_TICKET_STATUS
  is_timeout: boolean
  overage_time: number // 剩余处理时间，负值则已超时
  order_title: string // 需求用不到
  department_info: unknown // 需求用不到
  label_info: unknown // 需求用不到
  emergency_name: SRE_TICKET_EMERGENCY_NAME // 需求用不到
  env_info: unknown // 需求用不到
  assigner_info: unknown // 需求用不到
  watcher_info: unknown // 需求用不到
  reporter_info: unknown // 需求用不到
  reason_class_info: unknown // 需求用不到
  describe: string // 需求用不到
}

export class ListSreTicketResponse {
  count: number
  results: SreTicket[]
}
