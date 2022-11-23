import { EVALUATION_METRICS_TYPE } from '@/features/sdu-resource/entities/stock.entity'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class EditIncrementEstimate {
  @IsOptional()
  @IsString()
  az?: string

  @IsOptional()
  @IsString()
  cid?: string

  @IsOptional()
  @IsString()
  cluster?: string

  @IsOptional()
  @IsNumber()
  cpuLimitOneInsPeak?: number

  @IsOptional()
  @IsString()
  displayEnv?: string

  @IsOptional()
  @IsNumber()
  estimatedCpuIncrementTotal?: number

  @IsOptional()
  @IsString()
  estimatedLogic?: string

  @IsOptional()
  @IsNumber()
  estimatedMemIncrementTotal?: number

  @IsOptional()
  @IsNumber()
  estimatedQpsTotal?: number

  @IsOptional()
  @IsEnum(EVALUATION_METRICS_TYPE)
  evaluationMetrics?: EVALUATION_METRICS_TYPE

  @IsOptional()
  @IsNumber()
  gpuCardLimitOneInsPeak?: number

  @IsOptional()
  @IsString()
  machineModel?: string

  @IsOptional()
  @IsNumber()
  memLimitOneInsPeak?: number

  @IsOptional()
  @IsNumber()
  minInsCount?: number

  @IsOptional()
  @IsNumber()
  qpsMaxOneIns?: number

  @IsOptional()
  @IsString()
  remark?: string

  @IsOptional()
  @IsString()
  segment?: string
}

export class CreateIncrementEstimate {
  @IsNotEmpty()
  @IsString()
  az: string

  @IsNotEmpty()
  @IsString()
  cid: string

  @IsOptional()
  @IsString()
  cluster?: string

  @IsNotEmpty()
  @IsNumber()
  cpuLimitOneInsPeak: number

  @IsNotEmpty()
  @IsString()
  displayEnv: string

  @IsOptional()
  @IsNumber()
  estimatedCpuIncrementTotal?: number

  @IsNotEmpty()
  @IsString()
  estimatedLogic: string

  @IsOptional()
  @IsNumber()
  estimatedMemIncrementTotal?: number

  @IsOptional()
  @IsNumber()
  estimatedQpsTotal?: number

  @IsNotEmpty()
  @IsEnum(EVALUATION_METRICS_TYPE)
  evaluationMetrics: EVALUATION_METRICS_TYPE

  @IsNotEmpty()
  @IsNumber()
  gpuCardLimitOneInsPeak: number

  @IsNotEmpty()
  @IsString()
  level1: string

  @IsNotEmpty()
  @IsString()
  level2: string

  @IsOptional()
  @IsString()
  level3?: string

  @IsNotEmpty()
  @IsString()
  machineModel: string

  @IsNotEmpty()
  @IsNumber()
  memLimitOneInsPeak: number

  @IsNotEmpty()
  @IsNumber()
  minInsCount: number

  @IsOptional()
  @IsNumber()
  qpsMaxOneIns?: number

  @IsOptional()
  @IsString()
  remark?: string

  @IsNotEmpty()
  @IsString()
  segment: string
}

export class OpenApiIncrementData {
  az: string
  cid: string
  cluster: string
  cpuLimitOneInsPeak: number
  editStatus: number
  displayEnv: string
  estimatedCpuIncrement: number
  estimatedCpuIncrementTotal: number
  estimatedGpuCardIncrement: number
  estimatedInsCountTotal: number
  estimatedLogic: string
  estimatedMemIncrement: number
  estimatedMemIncrementTotal: number
  estimatedQpsTotal: number
  evaluationMetrics: EVALUATION_METRICS_TYPE
  gpuCardLimitOneInsPeak: number
  incrementId: string
  level1DisplayName: string
  level2DisplayName: string
  level3DisplayName: string
  machineModel: string
  memLimitOneInsPeak: number
  minInsCount: number
  qpsMaxOneIns: number
  remark: string
  segment: string
  versionName: string
}

export class OpenApiIncrement {
  data: OpenApiIncrementData[]
  page: {
    offset: number
    limit: number
    total: number
  }
}

export class IncrementBasicInfo {
  cid: string
  displayEnv: string
  az: string
  cluster: string
  segment: string
}
export class IncrementMetaData {
  id: string
  level1: string
  level2: string
  level3: string
  version: string
}
export class IncrementEstimated {
  cpuLimitOneInsPeak: number
  estimatedCpuIncrement: number
  estimatedCpuIncrementTotal: number
  estimatedInsCountTotal: number
  estimatedLogic: string
  estimatedMemIncrement: number | null
  estimatedMemIncrementTotal: number | null
  estimatedGpuCardIncrement: number
  estimatedQpsTotal: number
  evaluationMetrics: EVALUATION_METRICS_TYPE
  gpuCardLimitOneInsPeak: number
  machineModel: string
  memLimitOneInsPeak: number | null
  minInsCount: number
  qpsMaxOneIns: number
  remark: string
}
export class FrontEndIncrement {
  metaData: IncrementMetaData
  data: {
    basicInfo: IncrementBasicInfo
    estimated: IncrementEstimated
  }
}
