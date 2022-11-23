import { OpenApiListQuery } from '@/common/dtos/openApi/list.dto'
import { OpenApiQuota } from '@/common/dtos/quota.dto'

export class OpenApiListPeriodicJobsQuery extends OpenApiListQuery {}

class PeriodicJobListItem {
  periodicJobId: string
  periodicJobName: string
  tenantId: string
  projectId: string
  enable: boolean
  period: string
  jobTemplate: PeriodicJobTemplate
  instanceTimeoutPolicy: string
  retainInstanceNum: number
  lastScheduleTime: number
  lastSuccessfulTime: number
  lastInstanceName: string
  lastInstancePhase: string
  createAt: string
}

export class ListPeriodicJobsResponse {
  total: number
  items: PeriodicJobListItem[]
}

class PeriodicJobTemplateTaskContainerResource {
  limits?: OpenApiQuota
  requests: OpenApiQuota
}

class PeriodicJobTemplateTaskContainerVolumeMounts {
  mountPath: string
  subPath: string
  readOnly?: boolean
}

class PeriodicJobTemplateTaskContainer {
  resource: PeriodicJobTemplateTaskContainerResource
  command: string[]
  env: Record<string, string>
  image: string
  volumeMounts: PeriodicJobTemplateTaskContainerVolumeMounts[]
}

class PeriodicJobTemplateTaskPolicie {
  action: string
  events: string[]
}

export class PeriodicJobTemplateTask {
  taskName: string
  replicas: number
  retryLimit: number
  initContainers?: PeriodicJobTemplateTaskContainer[]
  containers?: PeriodicJobTemplateTaskContainer[]
  policies?: PeriodicJobTemplateTaskPolicie[]
}

class PeriodicJobTemplate {
  env: string
  jobType: string
  priority: number
  tasks: PeriodicJobTemplateTask[]

  shareDir: string
  clusterId?: string
}

class PeriodicJobStatus {
  namespace: string
  lastScheduleTime: number
  lastTriggerTime: number
  lastInstanceName: string
  lastInstancePhase: string
  lastSuccessfulTime: number
}

export class GetPeriodicJobResponse {
  periodicJobId: string
  periodicJobName: string
  tenantId: string
  projectId: string
  enable: boolean
  period: string
  instanceTimeoutPolicy: string
  retainInstanceNum: number
  jobTemplate: PeriodicJobTemplate
  periodicJobStatus: PeriodicJobStatus
  creator: string
  creatorId: string
  createAt: string
}

export class OpenApiBatchActionPeriodicJobBodyPayload {
  periodicJobIds: string[]
}

export class OpenApiBatchDeletePeriodicJobBodyPayload extends OpenApiBatchActionPeriodicJobBodyPayload {
  deleteAll: boolean
}

export class OpenApiBatchEnablePeriodicJobBodyPayload extends OpenApiBatchActionPeriodicJobBodyPayload {
  enable: boolean
}

export class OpenApiBatchEnablePeriodicJobBody {
  payload: OpenApiBatchEnablePeriodicJobBodyPayload
}

export class OpenApiBatchDeletePeriodicJobBody {
  payload: OpenApiBatchDeletePeriodicJobBodyPayload
}

class BatchHandlePeriodicJobResults {
  id: string
  name: string
  status: string
}

export class OpenApiBatchHandlePeriodicJobResopnse {
  periodicJobResults: BatchHandlePeriodicJobResults[]
}
export class OpenApiEnablePeriodicJobBodyPayload {
  enable: string
}

export class OpenApiEnablePeriodicJobBody {
  payload: OpenApiEnablePeriodicJobBodyPayload
}

export class OpenApiCreatePeriodicJobBody {
  periodicJobName: string
  enable?: boolean
  period: string
  instanceTimeoutPolicy?: string
  retainInstanceNum?: number
  supportNotify?: boolean
  pendingOvertime?: number
  runningOvertime?: number
  parameters?: string
  jobTemplate: PeriodicJobTemplate
}

export class OpenApiUpdatePeriodicJobBody {
  payload: OpenApiUpdatePeriodicJobPayload
}

export class OpenApiUpdatePeriodicJobPayload {
  enable?: boolean
  period: string
  instanceTimeoutPolicy?: string
  retainInstanceNum?: number
  supportNotify?: boolean
  pendingOvertime?: number
  runningOvertime?: number
  parameters?: string
  jobTemplate: PeriodicJobTemplate
}
