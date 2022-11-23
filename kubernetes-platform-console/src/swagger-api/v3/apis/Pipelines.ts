import fetch from 'helpers/fetch'
import * as types from '../models'

/**
 * Get pipeline list.
 */
export interface IPipelinesControllerListPipelinesParams {
  tenantId: number
  offset?: number
  limit?: number
  filterBy?: string
}

/**
 * Get pipeline list.
 */
type PipelinesControllerListPipelinesFn = (
  params: IPipelinesControllerListPipelinesParams
) => Promise<types.IListPipelinesResponseDto>

/**
 * Get pipeline list.
 */
export const pipelinesControllerListPipelines: PipelinesControllerListPipelinesFn = async ({
  tenantId,
  offset,
  limit,
  filterBy
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines`,
    method: 'GET',
    params: { offset, limit, filterBy }
  })

  return body
}

/**
 * Create a new pipeline.
 */
export interface IPipelinesControllerCreatePipelineParams {
  tenantId: number
  payload: types.ICreatePipelinesBodyDto
}

/**
 * Create a new pipeline.
 */
type PipelinesControllerCreatePipelineFn = (params: IPipelinesControllerCreatePipelineParams) => Promise<{}>

/**
 * Create a new pipeline.
 */
export const pipelinesControllerCreatePipeline: PipelinesControllerCreatePipelineFn = async ({ tenantId, payload }) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines`,
    method: 'POST',
    payload
  })

  return body
}

/**
 * Update pipeline.
 */
export interface IPipelinesControllerUpdatePipelineParams {
  tenantId: number
  pipelineName: string
  payload: types.IUpdatePipelinesBodyDto
}

/**
 * Update pipeline.
 */
type PipelinesControllerUpdatePipelineFn = (
  params: IPipelinesControllerUpdatePipelineParams
) => Promise<types.IPipelineItem>

/**
 * Update pipeline.
 */
export const pipelinesControllerUpdatePipeline: PipelinesControllerUpdatePipelineFn = async ({
  tenantId,
  pipelineName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/${pipelineName}`,
    method: 'PUT',
    payload
  })

  return body
}

/**
 * Get pipeline detail.
 */
export interface IPipelinesControllerGetPipelineDetailParams {
  tenantId: number
  pipelineName: string
}

/**
 * Get pipeline detail.
 */
type PipelinesControllerGetPipelineDetailFn = (
  params: IPipelinesControllerGetPipelineDetailParams
) => Promise<types.IGetPipelineDetailResponseDto>

/**
 * Get pipeline detail.
 */
export const pipelinesControllerGetPipelineDetail: PipelinesControllerGetPipelineDetailFn = async ({
  tenantId,
  pipelineName
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/${pipelineName}`,
    method: 'GET'
  })

  return body
}

/**
 * Move pipeline to another tenant.
 */
export interface IPipelinesControllerMovePipelineParams {
  tenantId: number
  pipelineName: string
  payload: types.IMovePipelineBodyDto
}

/**
 * Move pipeline to another tenant.
 */
type PipelinesControllerMovePipelineFn = (params: IPipelinesControllerMovePipelineParams) => Promise<{}>

/**
 * Move pipeline to another tenant.
 */
export const pipelinesControllerMovePipeline: PipelinesControllerMovePipelineFn = async ({
  tenantId,
  pipelineName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/${pipelineName}`,
    method: 'PATCH',
    payload
  })

  return body
}

/**
 * Get pipeline git branches.
 */
export interface IPipelinesControllerGetGitBranchesParams {
  tenantId: number
  pipelineName: string
}

/**
 * Get pipeline git branches.
 */
type PipelinesControllerGetGitBranchesFn = (params: IPipelinesControllerGetGitBranchesParams) => Promise<string[]>

/**
 * Get pipeline git branches.
 */
export const pipelinesControllerGetGitBranches: PipelinesControllerGetGitBranchesFn = async ({
  tenantId,
  pipelineName
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/${pipelineName}/git_branches`,
    method: 'GET'
  })

  return body
}

/**
 * Create a pipeline run.
 */
export interface IPipelinesControllerCreatePipelineRunParams {
  tenantId: number
  pipelineName: string
  payload: types.ICreatePipelineRunBodyDto
}

/**
 * Create a pipeline run.
 */
type PipelinesControllerCreatePipelineRunFn = (
  params: IPipelinesControllerCreatePipelineRunParams
) => Promise<types.IPipelineRunDetail>

/**
 * Create a pipeline run.
 */
export const pipelinesControllerCreatePipelineRun: PipelinesControllerCreatePipelineRunFn = async ({
  tenantId,
  pipelineName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/${pipelineName}/runs`,
    method: 'POST',
    payload
  })

  return body
}

/**
 * Get pipeline runs list.
 */
export interface IPipelinesControllerListPipelineRunsParams {
  tenantId: number
  pipelineName: string
  offset?: number
  limit?: number
  filterBy?: string
}

/**
 * Get pipeline runs list.
 */
type PipelinesControllerListPipelineRunsFn = (
  params: IPipelinesControllerListPipelineRunsParams
) => Promise<types.IListPipelineRunsResponseDto>

/**
 * Get pipeline runs list.
 */
export const pipelinesControllerListPipelineRuns: PipelinesControllerListPipelineRunsFn = async ({
  tenantId,
  pipelineName,
  offset,
  limit,
  filterBy
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/${pipelineName}/runs`,
    method: 'GET',
    params: { offset, limit, filterBy }
  })

  return body
}

/**
 * Get pipeline run detail.
 */
export interface IPipelinesControllerGetPipelineRunDetailParams {
  tenantId: number
  pipelineName: string
  runId: string
}

/**
 * Get pipeline run detail.
 */
type PipelinesControllerGetPipelineRunDetailFn = (
  params: IPipelinesControllerGetPipelineRunDetailParams
) => Promise<types.IPipelineRunDetail>

/**
 * Get pipeline run detail.
 */
export const pipelinesControllerGetPipelineRunDetail: PipelinesControllerGetPipelineRunDetailFn = async ({
  tenantId,
  pipelineName,
  runId
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/${pipelineName}/runs/${runId}`,
    method: 'GET'
  })

  return body
}

/**
 * Get pipeline run result.
 */
export interface IPipelinesControllerGetPipelineRunResultParams {
  tenantId: number
  pipelineName: string
  runId: string
  engine: string
}

/**
 * Get pipeline run result.
 */
type PipelinesControllerGetPipelineRunResultFn = (
  params: IPipelinesControllerGetPipelineRunResultParams
) => Promise<types.IPipelineRunResult>

/**
 * Get pipeline run result.
 */
export const pipelinesControllerGetPipelineRunResult: PipelinesControllerGetPipelineRunResultFn = async ({
  tenantId,
  pipelineName,
  runId,
  engine
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/${pipelineName}/runs/${runId}/result`,
    method: 'GET',
    params: { engine }
  })

  return body
}

/**
 * Get pipeline run log.
 */
export interface IPipelinesControllerGetPipelineRunLogParams {
  tenantId: number
  pipelineName: string
  runId: string
  stepId: string
}

/**
 * Get pipeline run log.
 */
type PipelinesControllerGetPipelineRunLogFn = (
  params: IPipelinesControllerGetPipelineRunLogParams
) => Promise<types.IPipelineRunLog>

/**
 * Get pipeline run log.
 */
export const pipelinesControllerGetPipelineRunLog: PipelinesControllerGetPipelineRunLogFn = async ({
  tenantId,
  pipelineName,
  runId,
  stepId
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/${pipelineName}/runs/${runId}/steps/${stepId}/log`,
    method: 'GET'
  })

  return body
}

/**
 * Abort a pipeline run.
 */
export interface IPipelinesControllerAbortPipelineRunParams {
  tenantId: number
  pipelineName: string
  runId: string
}

/**
 * Abort a pipeline run.
 */
type PipelinesControllerAbortPipelineRunFn = (params: IPipelinesControllerAbortPipelineRunParams) => Promise<{}>

/**
 * Abort a pipeline run.
 */
export const pipelinesControllerAbortPipelineRun: PipelinesControllerAbortPipelineRunFn = async ({
  tenantId,
  pipelineName,
  runId
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/${pipelineName}/runs/${runId}/abort`,
    method: 'POST'
  })

  return body
}

/**
 * Abort a pending pipeline.
 */
export interface IPipelinesControllerAbortPendingPipelineParams {
  tenantId: number
  pipelineName: string
  queueId: string
}

/**
 * Abort a pending pipeline.
 */
type PipelinesControllerAbortPendingPipelineFn = (params: IPipelinesControllerAbortPendingPipelineParams) => Promise<{}>

/**
 * Abort a pending pipeline.
 */
export const pipelinesControllerAbortPendingPipeline: PipelinesControllerAbortPendingPipelineFn = async ({
  tenantId,
  pipelineName,
  queueId
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/${pipelineName}/queues/${queueId}/abort`,
    method: 'POST'
  })

  return body
}

/**
 * Rebuild a pipeline run.
 */
export interface IPipelinesControllerRebuildPipelineRunParams {
  tenantId: number
  pipelineName: string
  runId: string
}

/**
 * Rebuild a pipeline run.
 */
type PipelinesControllerRebuildPipelineRunFn = (params: IPipelinesControllerRebuildPipelineRunParams) => Promise<{}>

/**
 * Rebuild a pipeline run.
 */
export const pipelinesControllerRebuildPipelineRun: PipelinesControllerRebuildPipelineRunFn = async ({
  tenantId,
  pipelineName,
  runId
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/${pipelineName}/runs/${runId}/rebuild`,
    method: 'POST'
  })

  return body
}

/**
 * Rebuild a pipeline run.
 */
export interface IPipelinesControllerConfirmPipelineRunParams {
  tenantId: number
  pipelineName: string
  runId: string
  payload: types.IConfirmPipelineRunBodyDto
}

/**
 * Rebuild a pipeline run.
 */
type PipelinesControllerConfirmPipelineRunFn = (params: IPipelinesControllerConfirmPipelineRunParams) => Promise<{}>

/**
 * Rebuild a pipeline run.
 */
export const pipelinesControllerConfirmPipelineRun: PipelinesControllerConfirmPipelineRunFn = async ({
  tenantId,
  pipelineName,
  runId,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/${pipelineName}/runs/${runId}/confirmation`,
    method: 'POST',
    payload
  })

  return body
}

/**
 * Import pipelines.
 */
export interface IPipelinesControllerImportPipelinesParams {
  tenantId: number
  payload: types.IImportPipelinesBodyDto
}

/**
 * Import pipelines.
 */
type PipelinesControllerImportPipelinesFn = (params: IPipelinesControllerImportPipelinesParams) => Promise<{}>

/**
 * Import pipelines.
 */
export const pipelinesControllerImportPipelines: PipelinesControllerImportPipelinesFn = async ({
  tenantId,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/batchImport`,
    method: 'POST',
    payload
  })

  return body
}

/**
 * get all pipelines engines.
 */
export interface IPipelinesControllerGetAllPipelineEnginesParams {
  tenantId: number
}

/**
 * get all pipelines engines.
 */
type PipelinesControllerGetAllPipelineEnginesFn = (
  params: IPipelinesControllerGetAllPipelineEnginesParams
) => Promise<types.IPipelineEngine[]>

/**
 * get all pipelines engines.
 */
export const pipelinesControllerGetAllPipelineEngines: PipelinesControllerGetAllPipelineEnginesFn = async ({
  tenantId
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/engines/list`,
    method: 'GET'
  })

  return body
}

/**
 * get all pipeline names of a tenant.
 */
export interface IPipelinesControllerListAllPipelinesParams {
  tenantId: number
  filterBy?: string
}

/**
 * get all pipeline names of a tenant.
 */
type PipelinesControllerListAllPipelinesFn = (params: IPipelinesControllerListAllPipelinesParams) => Promise<string[]>

/**
 * get all pipeline names of a tenant.
 */
export const pipelinesControllerListAllPipelines: PipelinesControllerListAllPipelinesFn = async ({
  tenantId,
  filterBy
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/names/list`,
    method: 'GET',
    params: { filterBy }
  })

  return body
}

/**
 * batch migrate some pipelines to another engine.
 */
export interface IPipelinesControllerBatchMigratePipelinesParams {
  tenantId: number
  payload: types.IBatchMigratePipelinesBodyDto
}

/**
 * batch migrate some pipelines to another engine.
 */
type PipelinesControllerBatchMigratePipelinesFn = (
  params: IPipelinesControllerBatchMigratePipelinesParams
) => Promise<types.IBatchMigratePipelineResponseDto>

/**
 * batch migrate some pipelines to another engine.
 */
export const pipelinesControllerBatchMigratePipelines: PipelinesControllerBatchMigratePipelinesFn = async ({
  tenantId,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/migrations`,
    method: 'POST',
    payload
  })

  return body
}

/**
 * migrate a pipeline to another engine.
 */
export interface IPipelinesControllerMigratePipelineParams {
  tenantId: number
  pipelineName: string
  payload: types.IMigratePipelineBodyDto
}

/**
 * migrate a pipeline to another engine.
 */
type PipelinesControllerMigratePipelineFn = (params: IPipelinesControllerMigratePipelineParams) => Promise<{}>

/**
 * migrate a pipeline to another engine.
 */
export const pipelinesControllerMigratePipeline: PipelinesControllerMigratePipelineFn = async ({
  tenantId,
  pipelineName,
  payload
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/${pipelineName}/migration`,
    method: 'POST',
    payload
  })

  return body
}

/**
 * get pipeline migration list.
 */
export interface IPipelinesControllerGetPipelineMigrationDetailParams {
  tenantId: number
}

/**
 * get pipeline migration list.
 */
type PipelinesControllerGetPipelineMigrationDetailFn = (
  params: IPipelinesControllerGetPipelineMigrationDetailParams
) => Promise<types.IPipelineMigrationItem>

/**
 * get pipeline migration list.
 */
export const pipelinesControllerGetPipelineMigrationDetail: PipelinesControllerGetPipelineMigrationDetailFn = async ({
  tenantId
}) => {
  const body = await fetch({
    resource: `v3/tenants/${tenantId}/pipelines/migrations/detail`,
    method: 'GET'
  })

  return body
}
