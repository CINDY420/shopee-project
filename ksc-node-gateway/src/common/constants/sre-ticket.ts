interface IOpenApiSreTicketRole {
  [openApiRoleId: string]: number
}

// openapi的role id 与sre ticket的role id map。test和live环境不一样, 由sre工单系统提供。
const testOpenApiSreTicketRoleMap: IOpenApiSreTicketRole = {
  '2103': 101, // ksc-tenant-admin
  '2104': 108, // ksc-tenant-member
  '2105': 102, // ksc-project-admin
  '2106': 103, // ksc-project-member
}
const liveOpenApiSreTicketRoleMap: IOpenApiSreTicketRole = {
  '2103': 95, // ksc-tenant-admin
  '2104': 98, // ksc-tenant-member
  '2105': 96, // ksc-project-admin
  '2106': 97, // ksc-project-member
}
const envOpenApiSreTicketRoleMap: Record<string, IOpenApiSreTicketRole> = {
  test: testOpenApiSreTicketRoleMap,
  live: liveOpenApiSreTicketRoleMap,
}
export const openApiSreTicketRoleMap = envOpenApiSreTicketRoleMap[process.env.NODE_ENV || 'test']

//  sre ticket 紧急程度。sre工单系统提供
export enum SRE_TICKET_EMERGENCY_NAME {
  NORMAL = 'Normal',
  URGENT = 'Urgent',
  VERY_URGENT = 'Very Urgent',
}

interface ISreTicketEnvIdMap {
  [env: string]: number
}

// sre ticket环境id，sre工单系统提供
export const sreTicketEnvIdMap: ISreTicketEnvIdMap = {
  live: 6,
  test: 2,
}

export enum SRE_TICKET_STATUS {
  ASSIGN = 'assign', // 提单分配了审批人
  APPROVAL = 'approval', // 执行中的工单
  DONE = 'done', // 已经完成的
  CLOSE = 'close', // 人为关闭的
}

const envDepartmentIdMap: Record<string, number> = {
  test: 139,
  live: 148,
}
export const DEPARTMENT_ID = envDepartmentIdMap[process.env.NODE_ENV || 'test']
