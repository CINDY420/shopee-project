import { Body, Controller, Get, HttpStatus, Param, Patch, Query, Post, Delete } from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'

import { OpenApiService } from '@/common/modules/openApi/openApi.service'
import { ProjectService } from '@/features/project/project.service'
import { UpdateProjectResponse } from '@/common/dtos/openApi/project.dto'
import {
  ListProjectsQuery,
  ListProjectsParams,
  GetProjectParams,
  UpdateProjectParams,
  CreateProjectParams,
  UpdateProjectPayload,
  CreateProjectBody,
  DeleteProjectParams,
} from '@/features/project/dto/project.dto'

@ApiTags('Project')
@Controller('tenants/:tenantId/projects')
export class ProjectController {
  constructor(private readonly openApiService: OpenApiService, private readonly projectService: ProjectService) {}

  @Get()
  listProjects(@Param() listProjectsParams: ListProjectsParams, @Query() listProjectsQuery: ListProjectsQuery) {
    const { tenantId } = listProjectsParams
    return this.projectService.listProjects(tenantId, listProjectsQuery)
  }

  @Get(':projectId')
  getProject(@Param() getProjectParams: GetProjectParams) {
    const { tenantId, projectId } = getProjectParams
    return this.projectService.getProject(tenantId, projectId)
  }

  @Patch(':projectId')
  @ApiResponse({ status: HttpStatus.OK, type: UpdateProjectResponse, description: 'Update project' })
  updateProject(@Param() updateProjectParams: UpdateProjectParams, @Body() updateProjectPayload: UpdateProjectPayload) {
    const { tenantId, projectId } = updateProjectParams
    const { projectName, envQuotas, uss, logStore } = updateProjectPayload
    return this.openApiService.updateProject(tenantId, projectId, {
      displayName: projectName,
      envQuotas,
      uss,
      logStore,
    })
  }

  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: CreateProjectBody, description: 'Create project' })
  CreateProject(@Param() createProjectParams: CreateProjectParams, @Body() createProjectBody: CreateProjectBody) {
    const { tenantId } = createProjectParams
    const { projectName, envQuotas, uss, logStore } = createProjectBody
    return this.openApiService.createProject(tenantId, { displayName: projectName, envQuotas, uss, logStore })
  }

  @Delete(':projectId')
  deleteProject(@Param() deleteProjectParams: DeleteProjectParams) {
    const { tenantId, projectId } = deleteProjectParams
    return this.openApiService.deleteProject(tenantId, projectId)
  }
}
