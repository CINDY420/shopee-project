import { IsArray, IsNumberString, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { SegmentDetail } from '@/modules/segment/dto/segment.dto'
import { AZInfo } from '@/modules/global/dto/global.dto'

export class ListAppClusterConfigsQuery {
  @IsOptional()
  @IsString()
  cmdbTenantId?: string

  @IsOptional()
  @IsNumberString()
  pageNum?: string

  @IsOptional()
  @IsNumberString()
  pageSize?: string

  @IsOptional()
  @IsString()
  filterBy?: string
}

export class FullAppClusterConfig {
  clusterUuid?: string
  cmdbTenantId?: string
  clusterName?: string
  scope?: string
  segmentKey?: string
  segment?: SegmentDetail
  azKey?: string
  id?: string
  env?: string
  key?: string
  cid?: string
  az?: AZInfo
}

export class ListAppClusterConfigsResponse {
  total: number

  items: FullAppClusterConfig[]
}

export class AppClusterConfig {
  @IsString()
  @IsOptional()
  env?: string

  @IsString()
  @IsOptional()
  azKey?: string

  @IsString()
  @IsOptional()
  segmentKey?: string

  @IsString()
  @IsOptional()
  clusterUuid?: string

  @IsString()
  @IsOptional()
  scope?: string

  @IsString()
  @IsOptional()
  key?: string

  @IsString()
  @IsOptional()
  cmdbTenantId?: string
}

export class AddAppClusterConfigsBody {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AppClusterConfig)
  configs: AppClusterConfig[]
}

export class AddAppClusterConfigsResponse {
  ids: string[]
}

export class RemoveAppClusterConfigParam {
  @IsString()
  id: string
}

export class RemoveAppClusterConfigsBody {
  @IsArray()
  @IsString({ each: true })
  idList: string[]
}
