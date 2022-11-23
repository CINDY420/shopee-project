import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'

import { PayloadEnvQuota } from '@/common/dtos/quota.dto'
import { Type } from 'class-transformer'
import { ListQuery } from '@/common/dtos/list.dto'
import { OpenApiProjectUSS } from '@/common/dtos/openApi/project.dto'

export class ListProjectsQuery extends ListQuery {}

export class ListProjectsParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string
}

export class GetProjectParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string

  @IsNotEmpty()
  @IsString()
  projectId: string
}

export class UpdateProjectParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string

  @IsNotEmpty()
  @IsString()
  projectId: string
}

export class CreateProjectParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string
}

export class UpdateProjectPayload {
  @IsNotEmpty()
  @IsString()
  projectName: string

  @ValidateNested({ each: true })
  @Type(() => PayloadEnvQuota)
  envQuotas: PayloadEnvQuota[]

  @Type(() => OpenApiProjectUSS)
  uss?: OpenApiProjectUSS

  @IsOptional()
  @IsString()
  logStore?: string
}

export class CreateProjectBody {
  @IsNotEmpty()
  @IsString()
  projectName: string

  @ValidateNested({ each: true })
  @Type(() => PayloadEnvQuota)
  envQuotas: PayloadEnvQuota[]

  @Type(() => OpenApiProjectUSS)
  uss: OpenApiProjectUSS

  @IsOptional()
  @IsString()
  logStore?: string
}

class ProjectListItem {
  tenantId: string
  projectId: string
  displayName: string
  envs: string[]
  clusters: string[]
}

export class ListProjectsResponse {
  total: number
  items: ProjectListItem[]
}

class Metric {
  cpu: number // 单位: Core
  gpu: number // 单位： 个
  memory: number // 单位: GiB
}

export class ClusterMetric {
  clusterId: string
  clusterName: string
  used: Metric
  assigned: Metric
  quota: Metric
}

export class EnvClusterMetric {
  env: string
  clusterMetrics: ClusterMetric[]
}

export class GetProjectResponse {
  tenantId: string
  projectId: string
  displayName: string
  envClusterMetrics: EnvClusterMetric[]
  uss: OpenApiProjectUSS
  logStore: string
}

export class DeleteProjectParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string

  @IsNotEmpty()
  @IsString()
  projectId: string
}
