import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'

class SegmentMeta {
  @IsNotEmpty()
  @IsString()
  segmentKey: string

  @IsNotEmpty()
  @IsString()
  segmentName: string
}

class AzMeta {
  @IsNotEmpty()
  @IsString()
  azName: string

  @IsNotEmpty()
  @IsString()
  azKey: string

  @IsString()
  complianceType?: string

  @IsString()
  statefulness?: string

  @IsArray()
  labels: string[]

  @IsString()
  region?: string

  @ValidateNested()
  @Type(() => SegmentMeta)
  segments: SegmentMeta[]
}

export class ListAllAzsResponse {
  @ValidateNested()
  @Type(() => AzMeta)
  items: AzMeta[]
}

class SegmentNameItem {
  name: string
  segmentKeys: string[]
}
export class ListAllSegmentNamesResponse {
  items: SegmentNameItem[]
}

export class ListEnumsResponse {
  @ValidateNested()
  @Type(() => String)
  items: string[]
}

export class ListAzSegmentsQuery {
  @IsString()
  @IsOptional()
  env?: string
}

export class AZSegment {
  azKey: string
  segmentKey: string
  name: string
}

export class AZInfo {
  version?: string
  name?: string
  capability?: unknown[]
  env?: string
  clusters?: string[]
}

export class ListAzsSegmentsResponse {
  items: AZSegment[]
}

export class ListAllEnvsResponse {
  @IsArray()
  items: {
    name: string
    alias: string
    value: number
  }[]
}

export class ListAllCIDsResponse {
  @IsArray()
  items: {
    name: string
    alias: string
    value: number
    visible: boolean
  }[]
}
