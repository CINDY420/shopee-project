import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApplicationService } from '@/features/application/application.service'
import {
  ListApplicationsParams,
  ListApplicationsQuery,
  GetApplicationParams,
  ListApplicationsResponse,
  GetApplicationResponse,
  GetApplicationServiceNameParams,
  GetApplicationServiceNameResponse,
} from '@/features/application/dto/application.dto'
import { Pagination } from '@/common/decorators/parameters/pagination'
import { PaginateInterceptor } from '@/common/interceptors/pagination.inteceptor'

@ApiTags('Application')
@Controller('tenants/:tenantId/projects/:projectName')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Pagination({
    key: 'apps',
    countKey: 'totalCount',
    defaultOrder: 'name',
    canPaginationFilter: true,
  })
  @UseInterceptors(PaginateInterceptor)
  @Get('applications')
  listApplications(
    @Param() listApplicationsParams: ListApplicationsParams,
    @Query() _: ListApplicationsQuery, // use for swagger display
  ): Promise<ListApplicationsResponse> {
    return this.applicationService.listApplications(listApplicationsParams)
  }

  @Get('applications/:appName')
  getApplication(@Param() getApplicationParams: GetApplicationParams): Promise<GetApplicationResponse> {
    return this.applicationService.getApplication(getApplicationParams)
  }

  @Get('applications/:appName/serviceName')
  getApplicationServiceName(
    @Param() getApplicationServicenameParams: GetApplicationServiceNameParams,
  ): Promise<GetApplicationServiceNameResponse> {
    const { appName } = getApplicationServicenameParams
    return this.applicationService.getApplicationServiceName(appName)
  }
}
