import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class QuotaParam {
  @IsString()
  azKey: string

  @IsString()
  segmentKey: string
}

export class ListTenantsQuotaParams extends QuotaParam {}
export class ListTenantsQuotaQuery {
  @IsOptional()
  @IsString()
  filterBy?: string

  @IsOptional()
  @IsString()
  searchBy?: string
}

export class ListTenantsQuotaItem {
  tenantName: string
  tenantId: string
  env: string
  // unit is Cores
  cpuApplied: number
  cpuQuota: number
  // unit is byte
  memoryApplied: number
  memoryQuota: number
  az: string
  segment: string
  colSpan: number
}
export class ListTenantsQuotaResponse {
  items: ListTenantsQuotaItem[]
  total: number
}

export class ListTenantsQuotableEnvsResponse {
  quotableEnvs: string[]
}

class UpdateTenantsQuotaItem {
  @IsString()
  tenantId: string

  @IsString()
  env: string

  // unit is Cores
  @IsNumber()
  cpuQuota: number

  // unit is byte
  @IsNumber()
  memoryQuota: number

  @IsString()
  reason: string
}
export class UpdateTenantsQuotaBody {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateTenantsQuotaItem)
  items: UpdateTenantsQuotaItem[]
}

export class GetSegmentQuotaParams extends QuotaParam {}

export class GetSegmentQuotaQuery {
  @IsString()
  env: string
}

export class GetSegmentQuotaResponse {
  az: string
  segment: string
  env: string
  cpuApplied: number
  cpuAssigned: number
  cpuTotal: number
  memoryApplied: number
  memoryAssigned: number
  memoryTotal: number
  enabledQuota: boolean
}

export class UpdateSegmentQuotaParams extends QuotaParam {}

export class UpdateSegmentQuotaBody {
  @IsString()
  env: string

  @IsNumber()
  addCPU: number

  @IsNumber()
  addMemory: number

  @IsString()
  reason: string
}

export class SwitchQuotaParam extends QuotaParam {
  @IsString()
  env: string
}

export class SwitchQuotaBody {
  @IsBoolean()
  switch: boolean
}
