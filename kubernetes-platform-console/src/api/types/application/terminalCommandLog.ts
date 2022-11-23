import { IListParam } from 'api/types/common'
export interface ITerminalCommandLog {
  container: string
  detail: string
  nodeIP: string
  nodeName: string
  operator: string
  podIP: string
  podName: string
  time: string
  sessionId: string
}

export interface ITerminalCommandLogs {
  data: ITerminalCommandLog[]
  totalCount: number
}

export interface IListTerminalCommandLogsParam extends IListParam {
  startTime?: string
  endTime?: string
  tenantId: string
  projectName: string
  appName: string
}
