import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class GetClusterQuotasDto {
  clusterName: string
}

export class IQuota {
  @ApiProperty()
  assigned?: number

  @ApiProperty()
  limit?: number

  @ApiProperty()
  total?: number

  @ApiProperty()
  used?: number
}

export class IResourceQuotaDetail {
  @ApiProperty()
  cpu?: IQuota

  @ApiProperty()
  envName?: string

  @ApiProperty()
  memory?: IQuota

  @ApiProperty()
  name?: string
}

export class IGroupResourceQuotaInCluster {
  @ApiProperty()
  name?: string

  @ApiPropertyOptional()
  alias?: string

  @ApiProperty({ type: [IResourceQuotaDetail] })
  resourceQuotas?: IResourceQuotaDetail[]
}

export class IGetClusterQuotasResponseDto {
  @ApiProperty({ type: [IGroupResourceQuotaInCluster] })
  // huadong TODO replace groups with tenants
  groups?: IGroupResourceQuotaInCluster[]
}

export class IGetClusterQuotasResponseFromOpenApi {
  tenants?: IGroupResourceQuotaInCluster[]
}
