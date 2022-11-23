export interface ITerminalAccessRequest {
  approver: string
  createtime: string
  email: string
  group: string
  name: string
  requireres: string
  status: string
  updatetime: string
  id: string
  reason: string
  type: string
}

export interface ITerminalAccessRequestConfig {
  access: string
  action: string
}
