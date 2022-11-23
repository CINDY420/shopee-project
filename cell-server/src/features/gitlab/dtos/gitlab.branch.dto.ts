import { GitlabCommitSchemaDto } from '@/features/gitlab/dtos/gitlab.commit.dto'

export class GitlabBranchSchemaDto {
  name: string
  merged: boolean
  url: string
  commit: GitlabCommitSchemaDto
}

export class ListProjectBranchesParams {
  projectId: number
}

export class ListProjectBranchesResponse {
  branches: GitlabBranchSchemaDto[]
}

export class GetProjectBranchParams {
  projectId: number
  branchName: string
}

export class GetProjectBranchResponse extends GitlabBranchSchemaDto {}

export class CreateProjectBranchParams extends ListProjectBranchesParams {}

export class CreateProjectBranchQuery {
  branchName: string
  ref: string
}

export class CreateProjectBranchResponse extends GitlabBranchSchemaDto {}

export class DeleteProjectBranchParams extends GetProjectBranchParams {}
