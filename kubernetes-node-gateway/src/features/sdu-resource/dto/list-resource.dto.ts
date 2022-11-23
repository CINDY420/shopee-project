import { BigSale } from '@/features/sdu-resource/entities/big-sale.entity'
import { IsString } from 'class-validator'

export class ListAzsResponse {
  availableZones: string[]
  total: number
}

export class ListEnvsResponse {
  envs: string[]
  total: number
}

export class ListCidsResponse {
  cids: string[]
  total: number
}

export class ListClusterParams {
  @IsString()
  az: string
}

export class ListSegmentParams {
  @IsString()
  az: string
}

export class ListSegmentsResponse {
  segments: string[]
  total: number
}
export class ListClustersResponse {
  clusters: string[]
  total: number
}

export class ListMachineModelsResponse {
  machineModels: string[]
  total: number
}

export class ListBigSalesResponse {
  bigSales: BigSale[]
  total: number
}
