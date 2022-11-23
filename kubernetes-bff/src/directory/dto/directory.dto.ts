import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class IProjectDesc {
  @ApiProperty({ type: String })
  tenantName: string

  @ApiProperty({ type: Number })
  tenantId: number

  @ApiProperty({ type: String })
  name: string
}
export class IApplicationDesc extends IProjectDesc {
  @ApiProperty({ type: String })
  projectName: string
}

export class IDirectoryBaseResponse {
  @ApiProperty({ type: Number })
  totalCount: number

  @ApiProperty({ type: String })
  tenantName: string

  @ApiProperty({ type: Number })
  tenantId: number
}
export class ISearchTenantApplicationsResponse extends IDirectoryBaseResponse {
  @ApiProperty({ type: [IApplicationDesc] })
  applications: IApplicationDesc[]
}

export class IGroupDirectoryGetProjectsResponse extends IDirectoryBaseResponse {
  @ApiProperty({ type: [IProjectDesc] })
  projects: IProjectDesc[]
}

export class IGroupDirectoryGetQuery {
  @ApiPropertyOptional()
  searchBy: string
}

export class ITenantDesc {
  @ApiProperty({ type: Number })
  id: number

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: String })
  detail: string

  @ApiProperty({ type: String })
  createAt: string

  @ApiProperty({ type: String })
  updateAt: string
}

export class ITenantDirectoryGetTenantsResponse {
  @ApiProperty({ type: [ITenantDesc] })
  tenants: ITenantDesc[]

  @ApiProperty({ type: Number })
  totalSize: number
}

export class IGroupDirectoryGetDomainGroups {
  @ApiProperty({ type: Number })
  totalCount: number

  @ApiProperty({ type: [String] })
  domainGroups: string[]
}
