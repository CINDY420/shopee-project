import { IListParam } from 'api/types/common'

export interface ITerminalReplayLog {
  container: string
  nodeIP: string
  nodeName: string
  operator: string
  podIP: string
  podName: string
  sessionId: string
  time: string
  duration: string
}

export interface ITerminalReplayLogs {
  data: ITerminalReplayLog[]
  totalCount: number
}

export interface IListTerminalReplayLogsParam extends IListParam {
  startTime?: string
  endTime?: string
  tenantId: string
  projectName: string
  appName: string
}
