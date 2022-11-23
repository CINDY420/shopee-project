import { GetProjectClusters, GetProjectQuotas } from '@/features/project/entities/get-project.entity'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumberString, IsNumber, IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator'
import { ListQuery } from '@/common/models/dtos/list-query.dto'

export class ListProjectParams {
  @IsNumberString()
  tenantId: string
}

export class ListProjectQuery extends ListQuery {}
class Project {
  cids: string[]
  clusters: string[]
  envs: string[]
  name: string
  tenant: string
}
export class ListProjectResponse {
  totalCount: number
  tenantId: number
  projects: Project[]
}

export class CreateProjectParams {
  @IsNumberString()
  tenantId: string
}

export class Quota {
  @IsNumber()
  @IsNotEmpty()
  cpuTotal: number

  @IsNumber()
  @IsNotEmpty()
  memoryTotal: number

  @IsString()
  @IsNotEmpty()
  name: string
}

export class CreateProjectBody {
  @IsString()
  @IsNotEmpty()
  project: string

  @IsArray()
  @IsNotEmpty()
  cids: string[]

  @IsArray()
  @IsNotEmpty()
  envs: string[]

  @IsArray()
  @IsNotEmpty()
  orchestrators: string[]

  @IsArray()
  @IsOptional()
  quotas?: Quota[]
}

export class MoveProjectParams {
  @IsNumberString()
  tenantId: string

  @IsString()
  @IsNotEmpty()
  projectName: string
}

export class MoveProjectBody {
  @IsString()
  @IsNotEmpty()
  targetTenant: string
}

export class GetProjectParams {
  @IsNotEmpty()
  tenantId: number

  @IsNotEmpty()
  @IsString()
  projectName: string
}

export class GetProjectResponse {
  cids: string[]

  clusters: GetProjectClusters[]

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: { type: 'string' },
    },
  })
  envClusterMap: {
    [envName: string]: string[]
  }

  envs: string[]

  tenantName: string

  tenantId: number

  name: string

  quotas: GetProjectQuotas

  simpleClusters: string[]
}
