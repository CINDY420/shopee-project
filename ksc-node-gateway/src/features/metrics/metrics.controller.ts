import { Controller, Get, Query, HttpStatus, Param } from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'
import { MetricsService } from '@/common/modules/metrics/metrics.service'
import { GetTenantMetricsResponse, GetProjectMetricsResponse } from '@/common/dtos/metrics/metric.dto'

import {
  GetTenantMetricsParams,
  GetTenantMetricsQuery,
  GetProjectMetricsParams,
  GetProjectMetricsQuery,
  GetClusterMetricsParams,
} from '@/features/metrics/dto/metrics.dto'

@ApiTags('Metrics')
@Controller('')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('metrics/tenants/:tenantName')
  @ApiResponse({ status: HttpStatus.OK, type: GetTenantMetricsResponse, description: 'Get tenantMetrics' })
  GetTenantMetrics(
    @Param() getTenantMetricsParams: GetTenantMetricsParams,
    @Query() getTenantMetricsQuery: GetTenantMetricsQuery,
  ) {
    const { tenantName } = getTenantMetricsParams
    return this.metricsService.getTenantMetrics(tenantName, getTenantMetricsQuery)
  }

  @Get('metrics/tenants/:tenantName/projects/:projectName')
  @ApiResponse({ status: HttpStatus.OK, type: GetProjectMetricsResponse, description: 'Get projectMetrics' })
  GetProjectMetrics(
    @Param() getProjectMetricsParams: GetProjectMetricsParams,
    @Query() getProjectMetricsQuery: GetProjectMetricsQuery,
  ) {
    const { tenantName, projectName } = getProjectMetricsParams
    return this.metricsService.getProjectMetrics(tenantName, projectName, getProjectMetricsQuery)
  }

  @Get('metrics/clusters/:clusterId')
  @ApiResponse({ description: 'Get cluster metrics' })
  getClusterMetrics(@Param() getClusterMetricsParams: GetClusterMetricsParams) {
    const { clusterId } = getClusterMetricsParams
    return this.metricsService.getClusterMetrics(clusterId)
  }
}
