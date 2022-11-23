import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ProjectService } from '@/modules/project/project.service'
import { ListProjectsQuery, ListProjectsResponse } from '@/modules/project/project.dto'

@ApiTags('Project')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async listProjects(@Query() query: ListProjectsQuery): Promise<ListProjectsResponse> {
    return {
      items: await this.projectService.getProjectsByTenantId(query.tenantId),
    }
  }
}
