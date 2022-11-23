import { MIGRATION_TASK_STATUS } from 'constants/pipeline'

enum PipelineStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  RUNNING = 'RUNNING',
  ABORTED = 'ABORTED'
}
export interface IPipelineParameter {
  description?: string
  name: string
  value: string | boolean
  type?: string
  choices?: string[]
}
export interface IPipeline {
  id: string
  name: string
  engine: string
  project: string
  module: string
  env: string
  isStdDeploy: boolean
  lastRun: {
    id: string
    status: PipelineStatus
    executor: string
    executeTime: string
    displayName: string
    parameters: IPipelineParameter[]
  }
  parameterDefinitions: IPipelineParameter[]
}

export interface ICreatePipeline {
  pipelineName: string
  lastExecuteStatus: string
  lastExecutor: string
  lastExecuteId: string
  lastExecuteTime: string
}
export interface IUpdatePipeline {
  pipelineName: string
  lastExecuteStatus: string
  lastExecutor: string
  lastExecuteId: string
  lastExecuteTime: string
}
export interface IListPipeline {
  id: string
  pipelineName: string
  lastExecuteStatus: string
  lastExecutor: string
  lastExecuteId: string
  lastExecuteTime: string
  engine: string
  env: string
  module: string
  project: string
  isFreezing: boolean
}
export interface IListPipelines {
  pipelines: IListPipeline[]
  totalSize: number
  offset: number
  limit: number
}

export interface IPipelineRunHistories {
  items: IPipelineRunDetail[]
  offset: number
  limit: number
  totalSize: number
}

export interface IPipelineRunDetail {
  id: string
  queueItemID?: string
  status: string
  executor: string
  executeTime: string
  endTime?: string
  displayName: string
  parameters: IPipelineParameter[]
  stages?: IStage[]
  nextPendingInput?: INextPendingInput
}

export interface IStage extends IStep {
  steps: IStep[]
}

export interface IStep {
  durationMillis: number
  id: string
  name: string
  status: string
}

export interface INextPendingInput {
  id: string
  message: string
  inputs: IInput[]
}

export interface IInput {
  type: string
  name: string
  description: string
  definition: IDefinition
}

export interface IDefinition {
  defaultVal: string
  choices: string[]
}

export interface IStepLog {
  hasMore: boolean
  length: number
  nodeId: string
  nodeStatus: string
  text: string
}

export interface IFailedResult {
  level: number
  msg: string
  tips: string
  type: string
}

export interface IEngine {
  name: string
  region: string
  type: string
}

export interface IDetails {
  sourceEngine: string
  destEngine: string
  name: string
  project: string
  module: string
  status: string
  message: string
}

export interface IMigrationStatus {
  id: string
  cursor: number
  failedCount: number
  migratingCount: number
  pendingCount: number
  succeededCount: number
  totalCount: number
  destEngine: string
  updatedAt: string
  startedAt: string
  status: MIGRATION_TASK_STATUS
  details: IDetails[]
}

export interface IReleaseFreezeDetail {
  id: string
  status: string
  env: string
  startTime: string
  endTime: string
  reason: string
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  resource: string
}

export interface IListReleaseFreezes {
  releaseFreezeList: IReleaseFreezeDetail[]
  total: number
}

export interface ILastReleaseFreeze {
  isFreezing: boolean
  item: IReleaseFreezeDetail
}

export interface IPipelineBuild {
  buildId: string
  executeTime?: string
  executor?: string
  status?: string
}

export interface IListPipelineBuilds {
  builds: IPipelineBuild[]
  total: number
}

export interface IPipelineBuildLogs {
  finished: boolean
  nextStart: number
  text: string
}
export interface IPipelineParameters {
  parameters: IPipelineParameter[]
}

export interface IParameterDefinition {
  description: string
  value: string | boolean
  name: string
  type: string
  choices: string[]
}
export interface ILastRun {
  displayName: string
  executeTime: string
  executor: string
  id: string
  status: string // should be enum, do it next time
}
export interface IConfig {
  DEPLOY_DEFINITION: string
  DEPLOY_TO_K8S: string
  DEPLOY_TO_K8S_ONLY: string
  ENVIRONMENT: string
  EXTRA_HOSTS: string
  GIT_REPO: string
  K8S_CANARY_REPLICAS: string
  K8S_GROUP: string
  K8S_KEEP_SMB_SMOKE: string
  K8S_MAX_SURGE: string
  K8S_MAX_UNAVAILABLE: string
  K8S_CANARY_PERCENTAGE: string
  K8S_MESOSZK: string
  K8S_REPLICAS: string
  K8S_USE_ACTUAL_IDC: string
  PipelineTemplate: string
  TERMINATION_GRACE_PERIOD_SECONDS: string
  PLATFORMCLUSTER: string
  DetailConfig: string
}
