export class TaskRequestParam {
  ticketId: string
  taskId: string
}

export enum EXECUTE_TASK_ACTION {
  APPROVAL = 'approval',
  REJECT = 'reject',
}

export class ExecuteTaskParams {
  taskReqParams: TaskRequestParam[]
  tag: EXECUTE_TASK_ACTION
}

export class ExecuteTaskResponse {
  totalCount: number
  successCount: number
  errorInfos?: {
    code: number
    desc: string
    taskId: string
    reason: string
    processId: string
    ticketId: string
    ticketTitle: string
  }[]
}
