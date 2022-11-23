export class GitlabFileSchema {
  path: string
  code: string
}

export class ListProjectRepositoryFilesParams {
  projectId: number
  branchName: string
}

export class ListProjectRepositoryFilesResponse {
  files: GitlabFileSchema[]
}
