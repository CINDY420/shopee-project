import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { DirectoryService } from './directory.service'
import { AuthToken } from 'common/decorators/parameters/AuthToken'
import { AuthUser, IAuthUser } from 'common/decorators/parameters/AuthUser'
import {
  ISearchTenantApplicationsResponse,
  IGroupDirectoryGetProjectsResponse,
  ITenantDirectoryGetTenantsResponse,
  IGroupDirectoryGetDomainGroups,
  IGroupDirectoryGetQuery
} from 'directory/dto/directory.dto'

@ApiTags('Directory')
@Controller('/directory')
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Get('/tenants/:tenantId/projects/:projectName/applications')
  @ApiResponse({ status: 200, type: ISearchTenantApplicationsResponse, description: 'Search tenant applicatsions' })
  async groupDirectoryGetApplications(
    @Param('tenantId') tenantId: string,
    @Param('projectName') projectName: string,
    @Query() query: IGroupDirectoryGetQuery,
    @AuthUser() authUser: IAuthUser,
    @AuthToken() authToken: string
  ) {
    const { searchBy } = query
    return this.directoryService.tenantDirectoryGetApplications(
      authUser,
      Number(tenantId),
      projectName,
      searchBy,
      authToken
    )
  }

  @Get('/tenants/:tenantId/projects')
  @ApiResponse({ status: 200, type: IGroupDirectoryGetProjectsResponse, description: 'Get tenant projects' })
  async groupDirectoryGetProjects(
    @Param('tenantId') tenantId: number,
    @Query() query: IGroupDirectoryGetQuery,
    @AuthUser() authUser: IAuthUser,
    @AuthToken() authToken: string
  ) {
    const { searchBy } = query
    return this.directoryService.tenantDirectoryGetProjects(authUser, Number(tenantId), searchBy, authToken)
  }

  @Get('/tenants')
  @ApiResponse({ status: 200, type: ITenantDirectoryGetTenantsResponse, description: 'Get tenant directory tenants' })
  groupDirectoryGetGroups(
    @Query() query: IGroupDirectoryGetQuery,
    @AuthToken() authToken: string,
    @AuthUser() authUser: IAuthUser
  ) {
    const { searchBy } = query
    return this.directoryService.tenantDirectoryGetTenants(authUser, searchBy, authToken)
  }

  @ApiResponse({ status: 200, type: IGroupDirectoryGetDomainGroups, description: 'Get tenant domain groups' })
  @Get('/domainGroups')
  groupDirectoryGetDomainGroups(@Query('searchBy') searchBy: string) {
    return this.directoryService.groupDirectoryGetDomainGroups(searchBy)
  }
}
