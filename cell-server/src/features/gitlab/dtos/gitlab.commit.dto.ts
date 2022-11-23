import { GitlabFileSchema } from '@/features/gitlab/dtos/gitlab.repository.dto'

export class GitlabCommitSchemaDto {
  id: string
  title: string
  message: string
  url: string
}

export class CreateGitlabCommitParamsDto {
  projectId: number
  branchName: string
}

export class CreateGitlabCommitBodyDto {
  sourceCommitId: string
  commitMessage: string
  files: GitlabFileSchema[]
}

export class CreateGitlabCommitResponseDto extends GitlabCommitSchemaDto {}
