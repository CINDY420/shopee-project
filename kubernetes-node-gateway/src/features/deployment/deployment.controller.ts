import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common'
import { DeploymentService } from '@/features/deployment/deployment.service'
import { ApiTags } from '@nestjs/swagger'
import {
  ListTasksParams,
  ListTasksQuery,
  ListTasksResponse,
  ListDeploymentHistoryParams,
  ListDeploymentHistoryQuery,
  ListDeploymentHistoryResponse,
  GetDeploymentQuery,
  GetDeploymentResponse,
  GetDeploymentParams,
} from '@/features/deployment/dto/deployment.dto'
import { Pagination } from '@/common/decorators/parameters/pagination'
import { PaginateInterceptor } from '@/common/interceptors/pagination.inteceptor'

@ApiTags('Deployment')
@Controller('tenants/:tenantId/projects/:projectName/applications/:appName')
export class DeploymentController {
  constructor(private readonly deploymentService: DeploymentService) {}

  @Pagination({
    key: 'items',
    countKey: 'totalCount',
    defaultOrder: 'createTime desc',
    canPaginationFilter: false,
  })
  @UseInterceptors(PaginateInterceptor)
  @Get('sdus/:sduName/tasks')
  ListTasks(
    @Param() listTasksParams: ListTasksParams,
    @Query() listTasksQuery: ListTasksQuery,
  ): Promise<ListTasksResponse> {
    return this.deploymentService.listTasks(listTasksParams, listTasksQuery)
  }

  @Pagination({
    key: 'items',
    countKey: 'totalCount',
    defaultOrder: 'updateTime desc',
    canPaginationFilter: false,
  })
  @UseInterceptors(PaginateInterceptor)
  @Get('sdus/:sduName/history')
  ListDeploymentHistory(
    @Param() listDeploymentHistoryParams: ListDeploymentHistoryParams,
    @Query() listDeploymentHistoryQuery: ListDeploymentHistoryQuery,
  ): Promise<ListDeploymentHistoryResponse> {
    return this.deploymentService.listDeploymentHistory(listDeploymentHistoryParams, listDeploymentHistoryQuery)
  }

  @Get('deployments/:deploymentName')
  getDeployment(
    @Param() getDeploymentParams: GetDeploymentParams,
    @Query() getDeploymentQuery: GetDeploymentQuery,
  ): Promise<GetDeploymentResponse> {
    return this.deploymentService.getDeployment(getDeploymentParams, getDeploymentQuery)
  }
}
