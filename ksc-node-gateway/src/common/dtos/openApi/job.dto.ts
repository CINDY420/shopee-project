import { OpenApiListQuery } from '@/common/dtos/openApi/list.dto'
import { PeriodicJobTemplateTask } from '@/common/dtos/openApi/periodicJob.dto'
import { OpenApiQuota } from '@/common/dtos/quota.dto'

class JobListItem {
  jobId: string
  jobName: string
  projectId: string
  env: string
  jobType: string
  priority: number
  shareDir: string
  creator: string
  creatorId: string
  clusterId: string
  clusterName: string
  startTime: string
  endTime: string
  status: string
  duration: string
  logStore: string
}

export class ListJobsResponse {
  total: number
  items: JobListItem[]
}

export class OpenApiListJobsQuery extends OpenApiListQuery {}

class OpenApiJobResponseStatus {
  namespace: string
  startTime: number // utc number
  endTime: number
  jobPhase: string
  message: string
  taskStatus: string
}

class OpenApiJobResponseOverview {
  Failed: number
  Pending: number
  Running: number
  Succeeded: number
  Unknown: number
  Total: number
}

class OpenApiJobResponseTaskContainerVolumeMounts {
  mountPath: string
  subPath: string
  readOnly: boolean
}

export class OpenApiJobResponseTaskContainer {
  resource: {
    limits: OpenApiQuota
    requests: OpenApiQuota
  }

  command: string[] // crd 已经定义好的字段，这里保持和集群crd、openapi数据统一
  env: OpenApiJobResponseOverview
  image: string
  volumeMounts: OpenApiJobResponseTaskContainerVolumeMounts[]
}

class OpenApiJobResponseTaskPolicies {
  action: string
  events: string[]
}

class OpenApiJobResponseTask {
  taskName: string
  replicas: number
  retryLimit: number
  initContainers: OpenApiJobResponseTaskContainer[]
  containers: OpenApiJobResponseTaskContainer[]
  policies: OpenApiJobResponseTaskPolicies[]
}

export class OpenApiGetJobResponse {
  jobId: string
  jobName: string
  projectId: string
  env: string
  jobType: string
  priority: number
  tasks: OpenApiJobResponseTask[]
  creator: string
  creatorId: string
  shareDir: string
  clusterId: string
  clusterName: string
  status: OpenApiJobResponseStatus
  podOverview: OpenApiJobResponseOverview
  logStore: string
}

export class OpenApiBatchKillJobBodyPayload {
  jobIds: string[]
}

export class OpenApiBatchDeleteJobBodyPayload extends OpenApiBatchKillJobBodyPayload {
  deleteAll: boolean
}

export class OpenApiBatchKillJobBody {
  payload: OpenApiBatchKillJobBodyPayload
}

export class OpenApiBatchDeleteJobBody {
  payload: OpenApiBatchDeleteJobBodyPayload
}

class BatchHandleJobResults {
  id: string
  name: string
  status: string
}

export class OpenApiBatchHandleJobResopnse {
  jobResults: BatchHandleJobResults[]
}

class OpenApiScaleJobBodyTask {
  taskName: string
  replicas: number
}

export class OpenApiScaleJobBody {
  payload: OpenApiScaleJobBodyTask[]
}

export class OpenApiCreateJobBody {
  env: string
  jobName: string
  jobType: string
  priority: number
  shareDir?: string
  tasks: PeriodicJobTemplateTask[]

  clusterId?: string
  supportNotify?: boolean
  pendingOvertime?: number
  runningOvertime?: number
  parameters?: string
  nodeKey?: string
  ports?: number[]
  toleration?: string
  webhook?: string
}
