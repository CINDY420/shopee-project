export interface IConfigItem {
  count: number
  items: string[]
}

export interface ICluster {
  cid: string
  clustername: string
  environment: string
}

export interface IClusterList {
  count: number
  items: ICluster[]
}
