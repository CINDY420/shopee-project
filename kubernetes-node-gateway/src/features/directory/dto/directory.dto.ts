import { IsNumberString, IsString, IsOptional } from 'class-validator'

export class ListDirectoryProjectsParams {
  @IsNumberString()
  tenantId: string
}
export class ListDirectoryProjectsQuery {
  @IsOptional()
  searchBy?: string
}
class DirectoryProject {
  tenantId: number
  name: string
}
export class ListDirectoryProjectsResponse {
  totalCount: number
  tenantId: number
  projects: DirectoryProject[]
}

export class ListDirectoryApplicationsParams {
  @IsNumberString()
  tenantId: string

  @IsString()
  projectName: string
}
export class ListDirectoryApplicationsQuery {
  @IsOptional()
  searchBy?: string
}
class DirectoryApplication {
  tenantId: number
  tenantName: string
  projectName: string
  name: string
}
export class ListDirectoryApplicationsResponse {
  totalCount: number
  tenantId: number
  applications: DirectoryApplication[]
}
