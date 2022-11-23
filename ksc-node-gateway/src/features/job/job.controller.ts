import { Controller, Get, HttpStatus, Query, Param, Delete, Post, Body } from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'

import { OpenApiService } from '@/common/modules/openApi/openApi.service'
import { JobService } from '@/features/job/job.service'

import {
  ListJobsResponse,
  OpenApiBatchDeleteJobBodyPayload,
  OpenApiBatchKillJobBodyPayload,
  OpenApiCreateJobBody,
  OpenApiScaleJobBody,
} from '@/common/dtos/openApi/job.dto'
import {
  ListJobsQuery,
  ListJobsParams,
  GetJobParams,
  DeleteJobParams,
  KillJobParams,
  BatchHandleJobParams,
  RerunJobParams,
  KillJobBody,
  ScaleJobParams,
  CreateJobParams,
} from '@/features/job/dto/job.dto'
import { transformFrontendListQueryToOpenApiListQuery } from '@/common/utils/query'

@ApiTags('Job')
@Controller('tenants/:tenantId/projects/:projectId/jobs')
export class JobController {
  constructor(private readonly openApiService: OpenApiService, private readonly jobService: JobService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: ListJobsResponse, description: 'List jobs' })
  listJobs(@Param() listJobsParams: ListJobsParams, @Query() listJobsQuery: ListJobsQuery) {
    const { tenantId, projectId } = listJobsParams
    const openApiListJobsQuery = transformFrontendListQueryToOpenApiListQuery(listJobsQuery)
    const { offset, limit, filterBy, sortBy, keyword } = openApiListJobsQuery
    return this.openApiService.listJobs(tenantId, projectId, { offset, limit, filterBy, sortBy, keyword })
  }

  @Get(':jobId')
  getJob(@Param() getJobParams: GetJobParams) {
    const { tenantId, projectId, jobId } = getJobParams
    return this.jobService.getJob(tenantId, projectId, jobId)
  }

  @Delete(':jobId/delete')
  deleteJob(@Param() deleteJobParams: DeleteJobParams) {
    const { tenantId, projectId, jobId } = deleteJobParams
    return this.openApiService.deleteJob(tenantId, projectId, jobId)
  }

  @Post('[:]kill')
  killJob(@Param() killJobParams: KillJobParams, @Body() killJobBody: KillJobBody) {
    const { tenantId, projectId } = killJobParams
    const { jobId } = killJobBody
    return this.openApiService.killJob(tenantId, projectId, jobId)
  }

  @Delete('[:]batchDelete')
  batchDeleteJob(
    @Param() batchDeleteJobParams: BatchHandleJobParams,
    @Body() deleteJobBody: OpenApiBatchDeleteJobBodyPayload,
  ) {
    const { tenantId, projectId } = batchDeleteJobParams
    return this.openApiService.batchDeleteJob(tenantId, projectId, { payload: deleteJobBody })
  }

  @Post('[:]batchKill')
  batchKillJob(@Param() batchKillJobParams: BatchHandleJobParams, @Body() killJobBody: OpenApiBatchKillJobBodyPayload) {
    const { tenantId, projectId } = batchKillJobParams
    return this.openApiService.batchKillJob(tenantId, projectId, { payload: killJobBody })
  }

  @Post('[:]rerun')
  rerunJob(@Param() rerunJobParams: RerunJobParams, @Body() rerunJobBody: KillJobBody) {
    const { tenantId, projectId } = rerunJobParams
    const { jobId } = rerunJobBody
    return this.openApiService.rerunJob(tenantId, projectId, jobId)
  }

  @Post(':jobId/scale')
  scaleJob(@Param() scaleJobParams: ScaleJobParams, @Body() scaleJobBody: OpenApiScaleJobBody) {
    const { tenantId, projectId, jobId } = scaleJobParams
    return this.openApiService.scaleJob(tenantId, projectId, jobId, scaleJobBody)
  }

  @Post()
  createJob(@Param() createJobParams: CreateJobParams, @Body() createJobBody: OpenApiCreateJobBody) {
    const { tenantId, projectId } = createJobParams
    return this.openApiService.createJob(tenantId, projectId, createJobBody)
  }
}
