import { IsNotEmpty, IsString } from 'class-validator'

export class GetTenantMetricsParams {
  @IsNotEmpty()
  @IsString()
  tenantName: string
}

export class GetTenantMetricsQuery {
  env: string
  clusterName: string
  clusterId: string
}

export class GetProjectMetricsParams {
  @IsNotEmpty()
  @IsString()
  tenantName: string

  @IsNotEmpty()
  @IsString()
  projectName: string
}

export class GetProjectMetricsQuery {
  env: string
  clusterName: string
  clusterId: string
}

export class GetClusterMetricsParams {
  clusterId: string
}
