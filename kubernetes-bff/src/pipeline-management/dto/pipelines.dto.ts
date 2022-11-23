import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export enum MIGRATION_TASK_STATUS {
  success = 'succeeded',
  pending = 'pending',
  running = 'running',
  failed = 'failed'
}

// basic
export class PipelineItem {
  @ApiProperty()
  id: string

  @ApiProperty()
  pipelineName: string

  @ApiProperty()
  project: string

  @ApiProperty()
  module: string

  @ApiProperty()
  env: string

  @ApiProperty()
  lastExecuteStatus: string

  @ApiProperty()
  lastExecutor: string

  @ApiProperty()
  lastExecuteId: string

  @ApiProperty()
  lastExecuteTime: string

  @ApiProperty()
  isFreezing: boolean

  @ApiProperty()
  engine: string
}

export class PipelineConfig {
  @ApiProperty()
  pipelineTemplate: string

  @ApiProperty()
  gitRepo: string

  @ApiProperty()
  deployDefinition: string

  @ApiProperty()
  tenantName: string

  @ApiProperty()
  deployToK8s: boolean

  @ApiProperty()
  deployToK8sOnly: boolean

  @ApiProperty()
  k8sMesosZK: boolean

  @ApiProperty()
  k8sUseActualIDC: boolean

  @ApiProperty()
  k8sKeepSMBSmoke: boolean

  @ApiProperty()
  k8sReplicas: number

  @ApiProperty()
  k8sCanaryReplicas: number

  @ApiProperty()
  k8sMaxSurge: string

  @ApiProperty()
  k8sMaxUnavailable: string

  @ApiProperty()
  extraHosts: string

  @ApiProperty()
  k8sCanaryPercentage: string

  @ApiProperty({ type: Object })
  platformCluster: Record<string, string>

  @ApiProperty()
  terminationGracePeriodSeconds: number

  @ApiPropertyOptional()
  detailConfig?: string
}
export class ParameterItem {
  @ApiProperty()
  name: string

  @ApiProperty()
  type: string

  @ApiProperty()
  value: string | boolean | number
}

export class ParameterDefinitionItem {
  @ApiProperty()
  name: string

  @ApiProperty()
  type: string

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'value is required' })
  value: any

  @ApiProperty()
  description: string

  @ApiPropertyOptional({ type: [String] })
  choices: string[]
}

export class StepItem {
  @ApiProperty()
  name: string

  @ApiProperty()
  status: string

  @ApiProperty()
  id: string

  @ApiProperty()
  durationMillis: number

  @ApiProperty()
  parameterDescription: string
}
export class StageItem {
  @ApiProperty()
  name: string

  @ApiProperty()
  status: string

  @ApiProperty()
  id: string

  @ApiProperty()
  durationMillis: number

  @ApiProperty({ type: [StepItem] })
  description: StepItem[]
}
export class PipelineRunItem {
  @ApiProperty()
  id: string

  @ApiProperty()
  queueItemID: string

  @ApiProperty()
  status: string

  @ApiProperty()
  executor: string

  @ApiProperty()
  executeTime: string

  @ApiProperty()
  displayName: string

  @ApiProperty({ type: [ParameterItem] })
  parameters: ParameterItem[]
}
export class PipelineRunDetail {
  @ApiProperty()
  id: string

  @ApiProperty()
  status: string

  @ApiProperty()
  executor: string

  @ApiProperty()
  executeTime: string

  @ApiProperty()
  endTime: string

  @ApiProperty()
  duration: number

  @ApiProperty()
  displayName: string

  @ApiProperty({ type: [ParameterItem] })
  parameters: ParameterItem[]

  @ApiProperty({ type: [StageItem] })
  stages: StageItem[]

  @ApiProperty()
  queueItemID: string
}

export class PipelineRunResult {
  @ApiProperty()
  level: number

  @ApiProperty()
  msg: string

  @ApiProperty()
  tips: string

  @ApiProperty()
  type: string
}

// ListPipeline
export class ListPipelinesParamsDto {
  @ApiProperty()
  tenantId: number
}

export class ListPipelinesQueryDto {
  @ApiPropertyOptional({ type: Number })
  offset: number

  @ApiPropertyOptional({ type: Number })
  limit: number

  @ApiPropertyOptional()
  filterBy: string
}

export class ListPipelinesResponseDto {
  @ApiProperty({ type: [PipelineItem] })
  pipelines: PipelineItem[]

  @ApiPropertyOptional({ type: Number })
  offset: number

  @ApiPropertyOptional({ type: Number })
  limit: number

  @ApiProperty()
  totalSize: number
}

// Get Pipeine Detail
export class GetPipelineDetailParamsDto {
  @ApiProperty()
  tenantId: number

  @ApiProperty()
  pipelineName: string
}

export class GetPipelineDetailResponseDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  project: string

  @ApiProperty()
  module: string

  @ApiProperty()
  env: string

  @ApiProperty()
  isStdDeploy: boolean

  @ApiPropertyOptional({ type: PipelineRunItem })
  lastRun: PipelineRunItem

  @ApiProperty({ type: ParameterItem })
  parameterDefinitions: ParameterItem[]

  @ApiProperty()
  DetailConfig: string

  @ApiProperty()
  isCustom: string
}

// CreatePipeline
export class CreatePipelinesParamsDto {
  @ApiProperty()
  tenantId: number
}

export class CreatePipelinesBodyDto {
  @ApiPropertyOptional()
  tenantName: string

  @ApiProperty()
  project: string

  @ApiProperty()
  module: string

  @ApiPropertyOptional()
  engine: string

  @ApiPropertyOptional()
  env: string

  @ApiProperty({ type: [String] })
  envs: string[]

  @ApiProperty({ type: Object })
  engines: Record<string, string>

  @ApiProperty({ type: PipelineConfig })
  pipelineConfig: PipelineConfig

  @ApiProperty({ type: [ParameterDefinitionItem] })
  parameterDefinitions: ParameterDefinitionItem[]
}

// update Pipeline
export class UpdatePipelinesParamsDto {
  @ApiProperty()
  tenantId: number

  @ApiProperty()
  pipelineName: string
}
export class UpdatePipelinesBodyDto {
  @ApiPropertyOptional()
  tenantName: string

  @ApiProperty()
  project: string

  @ApiProperty()
  module: string

  @ApiPropertyOptional()
  engine: string

  @ApiPropertyOptional()
  env: string

  @ApiProperty({ type: [String] })
  envs: string[]

  @ApiProperty({ type: Object })
  engines: Record<string, string>

  @ApiProperty({ type: PipelineConfig })
  pipelineConfig: PipelineConfig

  @ApiProperty({ type: [ParameterDefinitionItem] })
  parameterDefinitions: ParameterDefinitionItem[]
}

// create pipeline run
export class CreatePipelineRunParamsDto {
  @ApiProperty()
  tenantId: number

  @ApiProperty()
  pipelineName: string
}
export class CreatePipelineRunBodyDto {
  @ApiProperty({ type: [ParameterItem] })
  parameters: ParameterItem[]
}

// get pipeline runs
export class ListPipelineRunsParamsDto {
  @ApiProperty()
  tenantId: number

  @ApiProperty()
  pipelineName: string
}

// List Pipeline Run
export class ListPipelineRunsQueryDto {
  @ApiPropertyOptional({ type: Number })
  offset: number

  @ApiPropertyOptional({ type: Number })
  limit: number

  @ApiPropertyOptional()
  filterBy: string
}

export class ListPipelineRunsResponseDto {
  @ApiProperty({ type: [PipelineRunDetail] })
  items: PipelineRunDetail[]

  @ApiPropertyOptional({ type: Number })
  offset: number

  @ApiPropertyOptional({ type: Number })
  limit: number

  @ApiProperty()
  totalSize: number
}

// get pipeline run detail
export class GetPipelineRunDetailParamsDto {
  @ApiProperty()
  tenantId: number

  @ApiProperty()
  pipelineName: string

  @ApiProperty()
  runId: string
}

// get pipeline run result
export class GetPipelineRunResultQueryDto {
  @ApiProperty()
  engine: string
}
export class GetPipelineRunResultParamsDto {
  @ApiProperty()
  tenantId: number

  @ApiProperty()
  pipelineName: string

  @ApiProperty()
  runId: string
}

// get git branches
export class GetGitBranchesParamsDto {
  @ApiProperty()
  tenantId: number

  @ApiProperty()
  pipelineName: string
}

// get Pipeline Run log
export class GetPipelineRunLogParamsDto {
  @ApiProperty()
  tenantId: number

  @ApiProperty()
  pipelineName: string

  @ApiProperty()
  runId: string

  @ApiProperty()
  stepId: string
}

export class PipelineRunLog {
  @ApiProperty()
  hasMore: boolean

  @ApiProperty()
  text: string
}
// rebuild pipeline run
export class RebuildPipelineRunParamsDto {
  @ApiProperty()
  tenantId: number

  @ApiProperty()
  pipelineName: string

  @ApiProperty()
  runId: string
}

// abort pipeline run
export class AbortPipelineRunParamsDto {
  @ApiProperty()
  tenantId: number

  @ApiProperty()
  pipelineName: string

  @ApiProperty()
  runId: string
}

// abort pending pipeline
export class AbortPendingPipelineParamsDto {
  @ApiProperty()
  tenantId: number

  @ApiProperty()
  pipelineName: string

  @ApiProperty()
  queueId: string
}

// confirm
export class ConfirmPipelineRunParamsDto {
  @ApiProperty()
  tenantId: number

  @ApiProperty()
  pipelineName: string

  @ApiProperty()
  runId: string
}

export class ConfirmParameter {
  @ApiProperty()
  name: string

  @ApiProperty()
  value: string
}
export class ConfirmPipelineRunBodyDto {
  @ApiProperty()
  inputId: string

  @ApiProperty({ type: [ConfirmParameter] })
  parameter: ConfirmParameter[]

  @ApiProperty()
  stepId: string
}

// import pipeline
export class ImportPipelinesParamsDto {
  @ApiProperty()
  tenantId: number
}

export class ImportPipelinesBodyDto {
  @ApiProperty()
  project: string

  @ApiProperty()
  engine: string

  @ApiProperty()
  names: string[]
}

// move pipeline
export class MovePipelineParamsDto {
  @ApiProperty()
  tenantId: number

  @ApiProperty()
  pipelineName: string
}

export class MovePipelineBodyDto {
  @ApiProperty()
  targetTenantId: number
}

// get all pipeline engines
export class ListPipelineEnginesParamsDto {
  @ApiProperty()
  tenantId: number
}

// list all pipelines
export class ListAllPipelinesParamsDto {
  @ApiProperty()
  tenantId: number
}
export class ListAllPipelinesQueryDto {
  @ApiPropertyOptional()
  filterBy: string
}

// get Pipeline Migration
export class GetPipelineMigrationParamsDto {
  @ApiProperty()
  tenantId: number
}

// migrate
export class MigratePipelineParamsDto {
  @ApiProperty()
  tenantId: number

  @ApiProperty()
  pipelineName: string
}

export class MigratePipelineBodyDto {
  @ApiProperty()
  destEngine: string
}

export class BatchMigratePipelinesParamsDto {
  @ApiProperty()
  tenantId: number
}

export class SourcePipeline {
  @ApiProperty()
  name: string

  @ApiProperty()
  engine: string
}
export class BatchMigratePipelinesBodyDto {
  @ApiProperty({ type: [String] })
  sourcePipelines: string[]

  @ApiProperty()
  destEngine: string
}

export class BatchMigratePipelineResponseDto {
  @ApiProperty()
  id: string
}
export class PipelineMigrationDetail {
  @ApiProperty()
  sourceEngine: string

  @ApiProperty()
  destEngine: string

  @ApiProperty()
  name: string

  @ApiProperty()
  project: string

  @ApiProperty()
  module: string

  @ApiProperty()
  status: string

  @ApiProperty()
  message: string
}

export class PipelineMigrationItem {
  @ApiProperty()
  failedCount: number

  @ApiProperty()
  migratingCount: number

  @ApiProperty()
  pendingCount: number

  @ApiProperty()
  succeededCount: number

  @ApiProperty()
  totalCount: number

  @ApiProperty()
  operator: string

  @ApiProperty()
  startedAt: string

  @ApiProperty({ type: [PipelineMigrationDetail] })
  details: PipelineMigrationDetail[]

  @ApiProperty()
  destEngine: string

  @ApiProperty({ enum: MIGRATION_TASK_STATUS })
  status: MIGRATION_TASK_STATUS

  @ApiProperty()
  updatedAt: string

  @ApiProperty()
  cursor: number
}

export class GetPipelineMigrationResponse {
  @ApiProperty({ type: [PipelineMigrationItem] })
  items: PipelineMigrationItem[]
}
export class PipelineEngine {
  @ApiProperty()
  name: string

  @ApiProperty()
  region: string

  @ApiProperty()
  type: string
}

export interface PipelineResponse {
  retCode: number

  message: string

  data: any
}
