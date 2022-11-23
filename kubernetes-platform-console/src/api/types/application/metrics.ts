interface IUsage {
  Ready: boolean
  alarm: string
  applied: number
  total: number
  used: number
}

export interface IMetrics {
  env: string
  cluster: string
  quota: {
    cpu: IUsage
    filesystem: IUsage
    memory: IUsage
  }
}
