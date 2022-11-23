import { Controller, Get, Post, Param, Body, Query, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ProjectService } from '@/features/project/project.service'
import {
  ListProjectParams,
  ListProjectQuery,
  ListProjectResponse,
  CreateProjectParams,
  CreateProjectBody,
  MoveProjectParams,
  MoveProjectBody,
  GetProjectParams,
  GetProjectResponse,
} from '@/features/project/dto/project.dto'
import { Pagination } from '@/common/decorators/parameters/pagination'
import { PaginateInterceptor } from '@/common/interceptors/pagination.inteceptor'

@ApiTags('Project')
@Controller('tenants/:tenantId')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Pagination({
    key: 'projects',
    countKey: 'totalCount',
    defaultOrder: 'name',
    canPaginationFilter: true,
  })
  @UseInterceptors(PaginateInterceptor)
  @Get('projects')
  listProject(
    @Param() listProjectParams: ListProjectParams,
    @Query() _: ListProjectQuery, // use for swagger display
  ): Promise<ListProjectResponse> {
    return this.projectService.listProject(listProjectParams)
  }

  @Post('projects')
  createProject(@Param() createProjectParams: CreateProjectParams, @Body() createProjectBody: CreateProjectBody) {
    return this.projectService.createProject(createProjectParams, createProjectBody)
  }

  @Post('projects/:projectName/move')
  moveProject(@Param() moveProjectParams: MoveProjectParams, @Body() moveProjectBody: MoveProjectBody) {
    return this.projectService.moveProject(moveProjectParams, moveProjectBody)
  }

  @Get('/projects/:projectName')
  getDetail(@Param() params: GetProjectParams): Promise<GetProjectResponse> {
    return this.projectService.getProject(params)
  }
}
