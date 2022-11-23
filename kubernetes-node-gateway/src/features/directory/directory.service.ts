import { Injectable } from '@nestjs/common'
import { OpenApiService } from '@/shared/open-api/open-api.service'
import {
  ListDirectoryProjectsResponse,
  ListDirectoryProjectsQuery,
  ListDirectoryApplicationsParams,
  ListDirectoryApplicationsQuery,
  ListDirectoryApplicationsResponse,
} from '@/features/directory/dto/directory.dto'

@Injectable()
export class DirectoryService {
  constructor(private readonly openApiService: OpenApiService) {}

  async listDirectoryProjects(
    tenantId: string,
    query: ListDirectoryProjectsQuery,
  ): Promise<ListDirectoryProjectsResponse> {
    const { searchBy } = query
    const allProjects = await this.openApiService.listAllProjects(tenantId)
    let searchedProjects = allProjects
    if (searchBy) {
      const searchRegexp = new RegExp(`.*${searchBy}.*`)
      searchedProjects = allProjects.filter((project) => searchRegexp.test(project.name))
    }
    const formattedProjects = searchedProjects.map(({ tenant, name }) => ({ tenantId: Number(tenant), name }))
    return {
      totalCount: formattedProjects.length,
      tenantId: Number(tenantId),
      projects: formattedProjects,
    }
  }

  async listDirectoryApplications(
    params: ListDirectoryApplicationsParams,
    query: ListDirectoryApplicationsQuery,
  ): Promise<ListDirectoryApplicationsResponse> {
    const { tenantId } = params
    const { searchBy } = query
    const allApplications = await this.openApiService.listAllApplications(params)
    let searchedApplications = allApplications
    if (searchBy) {
      const searchRegexp = new RegExp(`.*${searchBy}.*`)
      searchedApplications = allApplications.filter((application) => searchRegexp.test(application.name))
    }
    const formattedApplications = searchedApplications.map(({ tenantName, tenantId, projectName, name }) => ({
      tenantName,
      tenantId: Number(tenantId),
      projectName,
      name,
    }))
    return {
      totalCount: formattedApplications.length,
      tenantId: Number(tenantId),
      applications: formattedApplications,
    }
  }
}
