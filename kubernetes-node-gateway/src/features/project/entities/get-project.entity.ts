export class GetProjectCids {
  cid: string

  clusterIds: string[]
}

export class GetProjectClusters {
  cids: GetProjectCids[]

  environment: string
}

export class ProjectQuota {
  used: number

  assigned: number

  total: number

  limit: number
}

export class GetProjectQuotaDetail {
  name: string

  envName: string

  cpu: ProjectQuota

  memory: ProjectQuota
}

export class GetProjectQuota {
  name: string

  resourceQuotas: GetProjectQuotaDetail[]
}

export class GetProjectQuotas {
  clusters: GetProjectQuota[]
}
