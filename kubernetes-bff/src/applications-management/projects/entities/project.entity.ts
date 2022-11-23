export interface IMetricResult {
  metric: {
    __name__: string
  }
  values: [number, string][]
}

export interface IMetricResponse {
  status: string
  data: {
    resultType: string
    result: IMetricResult[]
  }
}

export interface IMetricListResponse {
  podName: string
  metrics: IMetricResponse
}

export interface IUsage {
  used: number
  applied: number
  total: number
  alarm: number
  Ready: boolean
}

export interface IProjectUsage {
  group: string
  project: string
  env: string
  cid: string
  cluster: string
  detail: {
    cpu: IUsage
    memory: IUsage
    filesystem: IUsage
  }
  tenant: string
}

export interface IProjectQuota {
  name: string
  cpuTotal: number
  memoryTotal: number
}

export interface IProjectQuotaMap {
  [clusterName: string]: IProjectQuota
}

export interface IProjectQuotas {
  group: string
  project: string
  quotas: {
    Quotas: {
      // {env}-*-{cluster}
      [zone in string]: IProjectQuota
    }
  }
}

export interface IProjectQuotasInES {
  group: string
  project: string
  tenant: string
  quotas: string
}

export interface IWhiteListProject {
  group: string
  project: string
  emails: Array<string>
  whiteList: string
}
