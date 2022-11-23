export class SummaryData {
  az: string
  cid: string
  cluster: string
  cpuIncrement: number
  cpuIncrementRatio: number
  cpuStock: number
  cpuTarget: number
  displayEnv: string
  gpuIncrement: number
  gpuIncrementRatio: number
  gpuStock: number
  gpuTarget: number
  insCountIncrement: number
  insCountIncrementRatio: number
  insCountStock: number
  insCountTarget: number
  level1DisplayName: string
  level2DisplayName: string
  level3DisplayName: string
  machineModel: string
  memIncrementRatio: number
  memStock: number | null
  memIncrement: number | null
  memTarget: number | null
  versionId: string
  versionName: string
}

export class Summary {
  data: SummaryData[]
  page: {
    offset: number
    limit: number
    total: number
  }
}
