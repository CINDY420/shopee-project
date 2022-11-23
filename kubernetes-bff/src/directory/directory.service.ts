import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common'
import { ESService } from 'common/modules/es/es.service'

import { ESIndex, ES_MAX_SEARCH_COUNT, ES_DEFAULT_OFFSET, ES_SUPER_MAX_SEARCH_COUNT } from 'common/constants/es'

import { IESProjectDetailResponse } from 'applications-management/projects/dto/create-project.dto'
import { ApplicationsService } from 'applications-management/applications/applications.service'
import { IDomainGroup } from 'gateway-management/domains/domains.entites'
import { AuthService } from 'common/modules/auth/auth.service'
import { IAuthUser } from 'common/decorators/parameters/AuthUser'

@Injectable()
export class DirectoryService {
  constructor(
    private readonly eSService: ESService,
    private readonly authService: AuthService,
    private readonly applicationService: ApplicationsService
  ) {}

  async tenantDirectoryGetApplications(
    authUser: IAuthUser,
    tenantId: number,
    projectName: string,
    searchBy: string,
    authToken: string
  ) {
    const visibleTenants = await this.authService.listVisibleTenants(authUser, authToken)
    const matchedTenant = visibleTenants.find(({ id }) => id === tenantId)

    if (!matchedTenant) {
      throw new ForbiddenException('you can not list application under this tenant')
    }

    const search = searchBy || '.*'
    const appSearchResult = await this.applicationService.searchTenantApplications(tenantId, projectName, search)
    if (!appSearchResult) {
      throw new BadRequestException('Fail to get search result')
    }

    const { total } = appSearchResult
    const documents = appSearchResult.documents || []

    return {
      totalCount: total,
      tenantName: matchedTenant.name, // fix frontend
      tenantId,
      applications: documents.map((document) => ({
        tenantName: matchedTenant.name,
        tenantId,
        projectName,
        name: document.app
      }))
    }
  }

  async tenantDirectoryGetProjects(authUser: IAuthUser, tenantId: number, searchBy: string, authToken: string) {
    const visibleTenants = await this.authService.listVisibleTenants(authUser, authToken)
    const matchedTenant = visibleTenants.find(({ id }) => id === tenantId)

    if (!matchedTenant) {
      throw new ForbiddenException('you can not list projects under this tenant')
    }

    const search = searchBy || '.*'
    const projectSearchResult = await this.eSService.booleanQueryAll<IESProjectDetailResponse>(
      ESIndex.PROJECT,
      {
        must: [
          {
            term: { tenant: tenantId }
          },
          {
            regexp: { project: `.*${search}.*` }
          }
        ]
      },
      ES_MAX_SEARCH_COUNT,
      ES_DEFAULT_OFFSET,
      ['project:asc']
    )

    if (!projectSearchResult) {
      throw new BadRequestException('Fail to get search result')
    }

    const { total } = projectSearchResult
    const documents = projectSearchResult.documents || []

    return {
      totalCount: total,
      tenantName: matchedTenant.name, // fix frontend
      tenantId: Number(tenantId),
      projects: documents.map((document) => ({
        tenantName: matchedTenant.name,
        tenantId,
        name: document.project
      }))
    }
  }

  async tenantDirectoryGetTenants(authUser: IAuthUser, searchBy: string, authToken: string) {
    const search = searchBy || '.*'
    const visibleTenants = await this.authService.listVisibleTenants(authUser, authToken)

    const reg = new RegExp(`.*${search}.*`, 'i')
    const searchedTenants = visibleTenants.filter(({ name }) => reg.test(name))

    return {
      totalCount: searchedTenants.length,
      tenants: searchedTenants
    }
  }

  async groupDirectoryGetDomainGroups(searchBy: string) {
    const search = searchBy || '.*'
    const domainGroupsSearchResult = await this.eSService.wildcardQuery<IDomainGroup>(
      ESIndex.DOMAIN_GROUP,
      'name',
      `*${search}*`,
      ES_SUPER_MAX_SEARCH_COUNT
    )

    const { total } = domainGroupsSearchResult
    const domainGroups = domainGroupsSearchResult.documents || []

    return {
      totalCount: total,
      domainGroups: domainGroups.map((domainGroup) => domainGroup.name)
    }
  }
}
