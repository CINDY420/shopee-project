import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator'
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger'
import configuration from 'common/config/configuration'

import {
  IsNotRepeat,
  IsNotEmptyArray,
  IsInArray,
  IsStringOrNull,
  IsIntOrNull,
  IsMatchRegExp
} from 'common/decorators/validations/common'
import { IProjectQuotasDto } from './project.quotas.dto'

const globalCids = configuration().global.cids

export class IProjectInfo {
  @ApiProperty()
  @IsNotEmpty()
  tenantId: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  projectName: string
}

class ICids {
  @ApiProperty({ type: String })
  cid: string

  @ApiProperty({ type: [String] })
  clusterIds: string[]
}

class IClusters {
  @ApiProperty({ type: [ICids] })
  cids: ICids[]

  @ApiProperty({ type: String })
  environment: string
}

export class IGetProjectDetailDtoResponse {
  @ApiProperty({ type: [String] })
  cids: string[]

  @ApiProperty({ type: [IClusters] })
  clusters: IClusters[]

  @ApiProperty()
  envClusterMap: {
    [envName: string]: string[]
  }

  @ApiProperty({ type: [String] })
  envs: string[]

  @ApiProperty({ type: String })
  tenantName: string

  @ApiProperty({ type: Number })
  tenantId: number

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: IProjectQuotasDto })
  quotas: IProjectQuotasDto

  @ApiProperty({ type: [String] })
  simpleClusters: string[]
}

export class IResourceQuotaInfo {
  @ApiProperty({ type: Number })
  cpuTotal?: number

  @ApiProperty({ type: Number })
  memoryTotal?: number

  @ApiProperty({ type: String })
  name?: string
}
export class IPlayLoadInfo {
  @IsNotEmpty()
  @IsNotEmptyArray({ message: 'Quotas array can not be empty' })
  @ApiProperty({ type: [IResourceQuotaInfo] })
  quotas: IResourceQuotaInfo[]

  @IsNotEmpty()
  @IsInArray(globalCids, { message: 'Invalid cid value' })
  @IsNotRepeat({ message: 'Cid value can not repeat' })
  @IsNotEmptyArray({ message: 'Cid array can not be empty' })
  @ApiProperty({ type: [String] })
  cids: string[]

  @IsMatchRegExp(/^[a-z]+/, { message: 'Must start with lowercase alpha a-z' })
  @IsMatchRegExp(/^[a-z0-9]+$/, { message: 'Can only contain lowercase alphanumeric(a-z0-9)' })
  @MinLength(2)
  @MaxLength(31)
  @ApiProperty({ type: String })
  project?: string
}

export class IESProjectDetailResponse {
  @ApiProperty({ type: [String] })
  cids: string[]

  @ApiProperty({ type: [String] })
  environments: string[]

  @ApiProperty({ type: [String] })
  relations: string[]

  @ApiProperty({ type: String })
  tenant: string

  @ApiProperty({ type: String })
  project: string

  @ApiProperty({ type: [String] })
  clusters: string[]

  @ApiProperty({ type: String })
  createtime: string

  @ApiProperty({ type: String })
  updatetime: string

  @ApiProperty({ type: [IResourceQuotaInfo] })
  quotas?: IResourceQuotaInfo[]
}

export interface ICluster {
  name: string
  config: string
}

export class ListQueryDto {
  @ApiPropertyOptional()
  @IsIntOrNull({ message: 'offset should be number or null' })
  offset: number

  @ApiPropertyOptional()
  @IsIntOrNull({ message: 'limit should be number or null' })
  limit: number

  @ApiPropertyOptional()
  @IsStringOrNull({ message: 'orderBy should be string or null' })
  orderBy: string

  @ApiPropertyOptional()
  @IsStringOrNull({ message: 'filterBy should be string or null' })
  filterBy: string
}

export interface IAgentServiceResult {
  metadata: any
  items: []
}

export interface ICreateOrUpdateProjectResult {
  cids: string[]
  clusters: string[]
  environments: string[]
  group: string
  project: string
  relations: string[]
}

export class IProjectListItem {
  @ApiProperty({ type: [String] })
  cids: string[]

  @ApiProperty({ type: [String] })
  clusters: string[]

  @ApiProperty({ type: [String] })
  envs: string[]

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: String })
  tenant: string
}
export class IProjectListResult {
  @ApiProperty({ type: String })
  tenantName: string

  @ApiProperty({ type: Number })
  tenantId: number

  @ApiProperty({ type: [IProjectListItem] })
  projects: IProjectListItem[]

  @ApiProperty({ type: Number })
  totalCount: number
}

class ItMetricsQuotaItem {
  @ApiProperty({ type: Number })
  used: number

  @ApiProperty({ type: Number })
  applied: number

  @ApiProperty({ type: String })
  alarm: string

  @ApiProperty({ type: Number })
  total: number
}

class IQuota {
  @ApiProperty({ type: ItMetricsQuotaItem })
  cpu: ItMetricsQuotaItem

  @ApiProperty({ type: ItMetricsQuotaItem })
  memory: ItMetricsQuotaItem

  @ApiProperty({ type: ItMetricsQuotaItem })
  filesystem: ItMetricsQuotaItem
}

export class IGetMetricsResult {
  @ApiProperty({ type: String })
  cluster: string

  @ApiProperty({ type: String })
  env: string

  @ApiProperty({ type: IQuota })
  quota: IQuota
}

export interface IProjectQuotaInfo {
  group: string
  project: string
  quotas: string
}

export class ClusterListByConfigInfoResponse {
  @ApiProperty()
  clusterIds: string[]
}
