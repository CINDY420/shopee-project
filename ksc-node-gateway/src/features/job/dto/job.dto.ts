import { IsNotEmpty, IsString } from 'class-validator'
import { ListQuery } from '@/common/dtos/list.dto'
import { DisplayQuota } from '@/common/dtos/quota.dto'

export class ListJobsQuery extends ListQuery {}

export class ListJobsParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string

  @IsNotEmpty()
  @IsString()
  projectId: string
}

export class GetJobParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string

  @IsNotEmpty()
  @IsString()
  projectId: string

  @IsNotEmpty()
  @IsString()
  jobId: string
}

class JobResponseStatus {
  namespace: string
  startTime: number // utc number
  endTime: number
  jobPhase: string
  message: string
  taskStatus: string
}

class JobResponseOverview {
  Failed: number
  Pending: number
  Running: number
  Succeeded: number
  Unknown: number
  Total: number
}

class JobResponseTaskContainerVolumeMounts {
  mountPath: string
  subPath: string
  readOnly: boolean
}

export class JobResponseTaskContainer {
  resource: {
    limits: DisplayQuota
    requests: DisplayQuota
  }

  command: string[] // crd 已经定义好的字段，这里保持和集群crd、openapi数据统一
  env: JobResponseOverview
  image: string
  volumeMounts: JobResponseTaskContainerVolumeMounts[]
}

class JobResponseTaskPolicies {
  action: string
  events: string[]
}

class JobResponseTask {
  taskName: string
  replicas: number
  retryLimit: number
  initContainers: JobResponseTaskContainer[]
  containers: JobResponseTaskContainer[]
  policies: JobResponseTaskPolicies[]
}

export class GetJobResponse {
  jobId: string
  jobName: string
  projectId: string
  env: string
  jobType: string
  priority: number
  tasks: JobResponseTask[]
  creator: string
  creatorId: string
  shareDir: string
  clusterId: string
  clusterName: string
  status: JobResponseStatus
  podOverview: JobResponseOverview
  logStore: string
}

export class BasicParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string

  @IsNotEmpty()
  @IsString()
  projectId: string
}

export class DeleteJobParams extends BasicParams {
  @IsNotEmpty()
  @IsString()
  jobId: string
}
export class KillJobParams extends BasicParams {}
export class RerunJobParams extends BasicParams {}
export class BatchHandleJobParams extends BasicParams {}
export class CreateJobParams extends BasicParams {}
export class ScaleJobParams extends BasicParams {
  @IsNotEmpty()
  @IsString()
  jobId: string
}

export class KillJobBody {
  jobId: string
}
export class RerunJobBody {
  jobId: string
}
