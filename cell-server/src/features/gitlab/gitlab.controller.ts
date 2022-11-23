import { GitlabToken } from '@/common/decorators/gitlab-token.decorator'
import { IJwtBody } from '@/features/auth/strategies/jwt.strategy'
import {
  CreateProjectBranchParams,
  CreateProjectBranchQuery,
  CreateProjectBranchResponse,
  DeleteProjectBranchParams,
  GetProjectBranchParams,
  GetProjectBranchResponse,
  ListProjectBranchesParams,
  ListProjectBranchesResponse,
} from '@/features/gitlab/dtos/gitlab.branch.dto'
import {
  CreateGitlabCommitBodyDto,
  CreateGitlabCommitParamsDto,
  CreateGitlabCommitResponseDto,
} from '@/features/gitlab/dtos/gitlab.commit.dto'
import {
  ListProjectRepositoryFilesParams,
  ListProjectRepositoryFilesResponse,
} from '@/features/gitlab/dtos/gitlab.repository.dto'
import { GitlabService } from '@/features/gitlab/gitlab.service'
import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Gitlab')
@Controller('gitlab')
export class GitlabController {
  constructor(private readonly gitlabService: GitlabService) {}

  @Get('projects/:projectId/repository/branches')
  async listProjectBranches(
    @Param() params: ListProjectBranchesParams,
    @GitlabToken() token: string,
  ): Promise<ListProjectBranchesResponse> {
    return this.gitlabService.listProjectBranches(params, token)
  }

  @Get('projects/:projectId/repository/branches/:branchName')
  async getProjectBranch(
    @Param() params: GetProjectBranchParams,
    @GitlabToken() token: string,
  ): Promise<GetProjectBranchResponse> {
    return this.gitlabService.getProjectBranch(params, token)
  }

  @Post('projects/:projectId/repository/branches')
  async createProjectBranch(
    @Param() params: CreateProjectBranchParams,
    @Query() query: CreateProjectBranchQuery,
    @GitlabToken() token: string,
  ): Promise<CreateProjectBranchResponse> {
    return this.gitlabService.createProjectBranch(params, query, token)
  }

  @Delete('projects/:projectId/repository/branches/:branchName')
  async deleteProjectBranch(
    @Param() params: DeleteProjectBranchParams,
    @GitlabToken() token: string,
  ): Promise<void> {
    return this.gitlabService.deleteProjectBranch(params, token)
  }

  @Get('projects/:projectId/repository/branches/:branchName/files')
  async listProjectRepositoryFiles(
    @Param() params: ListProjectRepositoryFilesParams,
    @GitlabToken() token: string,
  ): Promise<ListProjectRepositoryFilesResponse> {
    return this.gitlabService.listProjectRepositoryFiles(params, token)
  }

  @Post('projects/:projectId/repository/branches/:branchName/commits')
  async createCommit(
    @Param() params: CreateGitlabCommitParamsDto,
    @Body() body: CreateGitlabCommitBodyDto,
    @Req() req: { user: IJwtBody },
  ): Promise<CreateGitlabCommitResponseDto> {
    return this.gitlabService.createCommit(params, body, req.user)
  }
}
