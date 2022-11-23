import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { DirectoryService } from '@/features/directory/directory.service'
import {
  ListDirectoryProjectsParams,
  ListDirectoryProjectsQuery,
  ListDirectoryProjectsResponse,
  ListDirectoryApplicationsParams,
  ListDirectoryApplicationsQuery,
  ListDirectoryApplicationsResponse,
} from '@/features/directory/dto/directory.dto'

@ApiTags('Directory')
@Controller('/directory')
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Get('/tenants/:tenantId/projects')
  listDirectoryProjects(
    @Param() params: ListDirectoryProjectsParams,
    @Query() query: ListDirectoryProjectsQuery,
  ): Promise<ListDirectoryProjectsResponse> {
    const { tenantId } = params
    return this.directoryService.listDirectoryProjects(tenantId, query)
  }

  @Get('/tenants/:tenantId/projects/:projectName/applications')
  listDirectoryApplications(
    @Param() params: ListDirectoryApplicationsParams,
    @Query() query: ListDirectoryApplicationsQuery,
  ): Promise<ListDirectoryApplicationsResponse> {
    return this.directoryService.listDirectoryApplications(params, query)
  }
}
