import { Controller, Get, Query, Param, Delete, Post, Body, Patch } from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'

import { OpenApiService } from '@/common/modules/openApi/openApi.service'

import {
  ListPeriodicJobsQuery,
  ListPeriodicJobsParams,
  GetPeriodicJobParams,
  DeletePeriodicJobParams,
  RerunPeriodicJobParams,
  BatchHandlePeriodicJobParams,
  ListPeriodicJobInstancesQuery,
  ListPeriodicJobInstancesParams,
  EnablePeriodicJobParams,
  CreatePeriodicJobParams,
  UpdatePeriodicJobParams,
} from '@/features/periodicJob/dto/job.dto'
import { transformFrontendListQueryToOpenApiListQuery } from '@/common/utils/query'
import {
  OpenApiBatchDeletePeriodicJobBodyPayload,
  OpenApiBatchEnablePeriodicJobBodyPayload,
  OpenApiCreatePeriodicJobBody,
  OpenApiEnablePeriodicJobBodyPayload,
  OpenApiUpdatePeriodicJobPayload,
} from '@/common/dtos/openApi/periodicJob.dto'

@ApiTags('PeriodicJob')
@Controller('tenants/:tenantId/projects/:projectId/periodicJobs')
export class PeriodicJobController {
  constructor(private readonly openApiService: OpenApiService) {}

  @Get()
  @ApiResponse({ description: 'List periodic jobs' })
  listPeriodicJobs(
    @Param() listPeriodicJobsParams: ListPeriodicJobsParams,
    @Query() listPeriodicJobsQuery: ListPeriodicJobsQuery,
  ) {
    const { tenantId, projectId } = listPeriodicJobsParams
    const openApiListJobsQuery = transformFrontendListQueryToOpenApiListQuery(listPeriodicJobsQuery)
    const { offset, limit, filterBy, sortBy, keyword } = openApiListJobsQuery
    return this.openApiService.listPeriodicJobs(tenantId, projectId, { offset, limit, filterBy, sortBy, keyword })
  }

  @Get(':periodicJobId')
  getPeriodicJob(@Param() getJobParams: GetPeriodicJobParams) {
    const { tenantId, projectId, periodicJobId } = getJobParams
    return this.openApiService.getPeriodicJob(tenantId, projectId, periodicJobId)
  }

  @Get(':periodicJobId/instances')
  listPeriodicJobInstances(
    @Param() getJobParams: ListPeriodicJobInstancesParams,
    @Query() listPeriodicJobInstancesQuery: ListPeriodicJobInstancesQuery,
  ) {
    const { tenantId, projectId, periodicJobId } = getJobParams
    const openApiListJobsQuery = transformFrontendListQueryToOpenApiListQuery(listPeriodicJobInstancesQuery)
    const { offset, limit, filterBy, sortBy, keyword } = openApiListJobsQuery
    const periodicJobIdFilter = `periodicJobId==${periodicJobId}`
    const newFilterBy = filterBy ? `${filterBy};${periodicJobIdFilter}` : periodicJobIdFilter
    return this.openApiService.listJobs(tenantId, projectId, { offset, limit, filterBy: newFilterBy, sortBy, keyword })
  }

  @Delete(':periodicJobId/delete')
  deletePeriodicJob(@Param() deletePeriodicJobParams: DeletePeriodicJobParams) {
    const { tenantId, projectId, periodicJobId } = deletePeriodicJobParams
    return this.openApiService.deletePeriodicJob(tenantId, projectId, periodicJobId)
  }

  @Post(':periodicJobId/rerun')
  rerunPeriodicJob(@Param() rerunPeriodicJobParams: RerunPeriodicJobParams) {
    const { tenantId, projectId, periodicJobId } = rerunPeriodicJobParams
    return this.openApiService.rerunPeriodicJob(tenantId, projectId, periodicJobId)
  }

  @Post(':periodicJobId/enable')
  enablePeriodicJob(
    @Param() enablePeriodicJobParams: EnablePeriodicJobParams,
    @Body() enableJobBody: OpenApiEnablePeriodicJobBodyPayload,
  ) {
    const { tenantId, projectId, periodicJobId } = enablePeriodicJobParams
    return this.openApiService.enablePeriodicJob(tenantId, projectId, periodicJobId, { payload: enableJobBody })
  }

  @Delete('[:]batchDelete')
  batchDeletePeriodicJob(
    @Param() batchDeleteJobParams: BatchHandlePeriodicJobParams,
    @Body() deleteJobBody: OpenApiBatchDeletePeriodicJobBodyPayload,
  ) {
    const { tenantId, projectId } = batchDeleteJobParams
    return this.openApiService.batchDeletePeriodicJob(tenantId, projectId, { payload: deleteJobBody })
  }

  @Post('[:]batchEnable')
  batchEnablePeriodicJob(
    @Param() batchKillJobParams: BatchHandlePeriodicJobParams,
    @Body() enableJobBody: OpenApiBatchEnablePeriodicJobBodyPayload,
  ) {
    const { tenantId, projectId } = batchKillJobParams
    return this.openApiService.batchEnablePeriodicJob(tenantId, projectId, { payload: enableJobBody })
  }

  @Post()
  createPeriodicJob(
    @Param() createPeriodicJobParams: CreatePeriodicJobParams,
    @Body() createJobBody: OpenApiCreatePeriodicJobBody,
  ) {
    const { tenantId, projectId } = createPeriodicJobParams
    return this.openApiService.createPeriodicJob(tenantId, projectId, createJobBody)
  }

  @Patch(':periodicJobId')
  updatePeriodicJob(
    @Param() updatePeriodicJobParams: UpdatePeriodicJobParams,
    @Body() updatePeriodicJobPayload: OpenApiUpdatePeriodicJobPayload,
  ) {
    const { tenantId, projectId, periodicJobId } = updatePeriodicJobParams
    return this.openApiService.updatePeriodicJob(tenantId, projectId, periodicJobId, {
      payload: updatePeriodicJobPayload,
    })
  }
}
