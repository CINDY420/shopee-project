import { Injectable } from '@nestjs/common'
import { OpenApiService } from '@/shared/open-api/open-api.service'
import {
  ListProjectParams,
  CreateProjectParams,
  CreateProjectBody,
  MoveProjectParams,
  MoveProjectBody,
  ListProjectResponse,
  GetProjectParams,
} from '@/features/project/dto/project.dto'

@Injectable()
export class ProjectService {
  constructor(private readonly openApiService: OpenApiService) {}

  async listProject(listProjectParams: ListProjectParams): Promise<ListProjectResponse> {
    const { tenantId } = listProjectParams
    const allProjects = await this.openApiService.listAllProjects(tenantId)
    const formattedProjects = allProjects.map(({ name, tenant, cids, envs, clusters }) => ({
      name,
      tenant,
      cids,
      envs,
      clusters,
    }))
    return { totalCount: formattedProjects.length, tenantId: Number(tenantId), projects: formattedProjects }
  }

  async createProject(createProjectParams: CreateProjectParams, createProjectBody: CreateProjectBody) {
    return this.openApiService.createProject(createProjectParams.tenantId, createProjectBody)
  }

  async moveProject(moveProjectParams: MoveProjectParams, moveProjectBody: MoveProjectBody) {
    return this.openApiService.moveProject(moveProjectParams.tenantId, moveProjectParams.projectName, moveProjectBody)
  }

  async getProject(params: GetProjectParams) {
    return this.openApiService.getProject(params)
  }
}
