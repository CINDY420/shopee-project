import { AppSetupProgressStatus, CreateFEWorkbenchStep, TaskStep } from '@/common/constants/task'
import { CreationTaskType, CurrentStageInfo } from '@/features/application/dtos/get-application.dto'

export function getCurrentStage<TData = any>(
  taskId: number,
  subTaskId: number,
  options?: {
    data?: TData
    message?: string
    taskStatus?: AppSetupProgressStatus
    subTaskStatus?: AppSetupProgressStatus
    taskType?: CreationTaskType
  },
): CurrentStageInfo {
  const {
    data,
    message = 'ok',
    taskStatus = AppSetupProgressStatus.CREATING,
    subTaskStatus = AppSetupProgressStatus.CREATING,
    taskType = CreationTaskType.NORMAL,
  } = options || {}
  return {
    data,
    task: {
      id: taskId,
      status: taskStatus,
    },
    subTask: {
      message,
      taskType,
      id: subTaskId,
      status: subTaskStatus,
      startTime: Date.now(),
      modifyTime: Date.now(),
    },
  }
}

export function isLastTask(taskId: number, subTaskId: number) {
  return (
    taskId === TaskStep.CREATE_FE_WORKBENCH &&
    subTaskId === CreateFEWorkbenchStep.BIND_JENKINS_FOR_FE_WORKBENCH_APP
  )
}
