import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { OpenApiService } from '@/common/modules/openApi/openApi.service'
import { ApiTags, ApiResponse } from '@nestjs/swagger'
import { ListAllProductLinesResponse } from '@/common/dtos/openApi/tenant.dto'
import { JOB_STATUS, JOB_TYPE } from '@/common/constants/job'
import { ENV } from '@/common/constants/project'

import {
  ListAllJobStatusResponse,
  ListAllJobTypesResponse,
  ListAllEnvsResponse,
  ListAllProjectsParams,
} from '@/features/global/dto/global.dto'

@ApiTags('Global')
@Controller()
export class GlobalController {
  constructor(private readonly openApiService: OpenApiService) {}
  @Get('productLines')
  @ApiResponse({ status: HttpStatus.OK, type: ListAllProductLinesResponse, description: 'List all product lines' })
  listJobs() {
    return this.openApiService.listAllProductLines()
  }

  @Get('jobStatus')
  @ApiResponse({ status: HttpStatus.OK, type: ListAllJobStatusResponse, description: 'List all job status' })
  listAllJobStatus() {
    const jobStatus = Object.values(JOB_STATUS)
    return { total: jobStatus.length, items: jobStatus }
  }

  @Get('jobTypes')
  @ApiResponse({ status: HttpStatus.OK, type: ListAllJobTypesResponse, description: 'List all job types' })
  listAllJobTypes() {
    const jobTypes = Object.values(JOB_TYPE)
    return { total: jobTypes.length, items: jobTypes }
  }

  @Get('envs')
  listAllEnvs(): ListAllEnvsResponse {
    const envs = Object.values(ENV)
    return { total: envs.length, items: envs }
  }

  @Get('allTenants')
  listAllTenants() {
    // openApi 默认limit限制了20
    return this.openApiService.listAllTenants({ limit: '5000' })
  }

  @Get('tenants/:tenantId/allProjects')
  listAllProjects(@Param() listAllProjectsParams: ListAllProjectsParams) {
    const { tenantId } = listAllProjectsParams
    // openApi 默认limit限制了20
    return this.openApiService.listAllProjects(tenantId, { limit: '5000' })
  }
}
