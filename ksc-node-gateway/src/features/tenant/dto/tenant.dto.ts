import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { PayloadEnvQuota, DisplayQuota } from '@/common/dtos/quota.dto'
import { ListQuery } from '@/common/dtos/list.dto'

export class TenantListItem {
  tenantId: string
  displayName: string
  productLineId: number
  productLineName: string
  description: string
  quota: DisplayQuota
  tenantCmdbName: string
  tenantCmdbId: string
  oversoldRatio: string
  fuseEnvs: string[]
  status: string
}

export class ListTenantsResponse {
  total: number

  items: TenantListItem[]
}

export class CreateTenantPayload {
  @IsNotEmpty()
  @IsString()
  tenantCmdbName: string

  @IsNotEmpty()
  @IsString()
  tenantCmdbId: string

  @IsNotEmpty() // UX设计是必填
  @IsString()
  description: string

  @ValidateNested({ each: true })
  @Type(() => PayloadEnvQuota)
  envQuotas: PayloadEnvQuota[]

  @IsNotEmpty()
  oversoldRatio: number
}

export class GetTenantParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string
}

export class UpdateTenantParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string
}
export class UpdateTenantPayload {
  @IsNotEmpty()
  @IsString()
  tenantCmdbName: string

  @IsOptional()
  @IsString()
  description?: string

  @ValidateNested({ each: true })
  @Type(() => PayloadEnvQuota)
  envQuotas: PayloadEnvQuota[]

  @IsOptional()
  oversoldRatio?: number
}

export class ListTenantsQuery extends ListQuery {}

export class UpdateTenantsPayload {
  [key: string]: UpdateTenantPayload
}

export class UpdateTenantsResponse {
  successed: string[]
  failed: string[]
}
