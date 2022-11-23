import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export enum EVALUATION_METRICS_TYPE {
  CPU = 'CPU',
  MEM = 'MEM',
  QPS = 'QPS',
}

export class EditStockResource {
  @IsOptional()
  @IsString()
  displayEnv?: string

  @IsOptional()
  @IsEnum(EVALUATION_METRICS_TYPE)
  evaluationMetrics?: EVALUATION_METRICS_TYPE

  @IsOptional()
  @IsNumber()
  gpuCardLimitOneInsPeak?: number

  @IsOptional()
  @IsNumber()
  growthRatio?: number

  @IsOptional()
  @IsString()
  growthRatioAnnotation?: string

  @IsOptional()
  @IsNumber()
  inUse?: number

  @IsOptional()
  @IsString()
  machineModel?: string

  @IsOptional()
  @IsNumber()
  minInsCount?: number

  @IsOptional()
  @IsNumber()
  qpsMaxOneIns?: number

  @IsOptional()
  @IsNumber()
  qpsTotalPeak?: number

  @IsOptional()
  @IsString()
  remark?: string

  @IsOptional()
  @IsNumber()
  safetyThreshold?: number
}

export class OpenApiStock {
  data: OpenApiStockData[]
  page: {
    offset: number
    limit: number
    total: number
  }
}
export class OpenApiStockData {
  az: string
  cid: string
  cluster: string
  cpuAllocatedTotalPeak: number
  cpuLimitOneInsPeak: number
  cpuReqOneInsPeak: number
  cpuUsedOneInsPeak: number
  cpuUsedTotalPeak: number
  displayEnv: string
  editStatus: number
  estimatedCpuIncrement: number
  estimatedGpuCardIncrement: number
  estimatedInsCountIncrement: number
  estimatedInsCountTotal: number
  estimatedMemIncrement: number | null
  evaluationMetrics: EVALUATION_METRICS_TYPE
  gpuCardAllocatedTotalPeak: number
  gpuCardLimitOneInsPeak: number
  growthRatio: number
  growthRatioAnnotation: string
  inUse: number
  insCountPeak: number
  level1DisplayName: string
  level2DisplayName: string
  level3DisplayName: string
  machineModel: string
  memAllocatedTotalPeak: number | null
  memLimitOneInsPeak: number | null
  memReqOneInsPeak: number | null
  memUsedOneInsPeak: number | null
  memUsedTotalPeak: number | null
  minInsCount: number
  module: string
  project: string
  qpsMaxOneIns: number
  qpsTotalPeak: number
  remark: string
  safetyThreshold: number
  sdu: string
  sduClusterId: string
  segment: string
  versionName: string
}
export class StockBasicInfo {
  cid: string
  displayEnv: string
  az: string
  cluster: string
  segment: string
}
export class StockMetaData {
  id: string
  sdu: string
  level1: string
  level2: string
  level3: string
  version: string
  editStatus: number
}
export class StockReference {
  insCountPeak: number
  cpuReqOneInsPeak: number
  memLimitOneInsPeak: number | null
  gpuCardLimitOneInsPeak: number

  cpuLimitOneInsPeak: number
  memUsedOneInsPeak: number | null

  cpuAllocatedTotalPeak: number
  memAllocatedTotalPeak: number | null
  gpuCardAllocatedTotalPeak: number

  cpuUsedOneInsPeak: number
  memReqOneInsPeak: number | null
  cpuUsedTotalPeak: number
  memUsedTotalPeak: number | null
}

export class StockGrowthExpectation {
  qpsTotalPeak: number
  qpsMaxOneIns: number
  inUse: number
  evaluationMetrics: EVALUATION_METRICS_TYPE
  growthRatio: number
  growthRatioAnnotation: string
  minInsCount: number
  safetyThreshold: string
  remark: string
  machineModel: string
}

export class StockEstimated {
  estimatedCpuIncrement: number
  estimatedGpuCardIncrement: number
  estimatedInsCountIncrement: number
  estimatedInsCountTotal: number
  estimatedMemIncrement: number | null
}

export class FrontEndStock {
  metaData: StockMetaData
  data: {
    basicInfo: StockBasicInfo
    reference: StockReference
    growthExpectation: StockGrowthExpectation
    estimated: StockEstimated
  }
}
