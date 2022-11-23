export class Usage {
  quota: string
  usage: string
  assigned: string
  total: string
}

export class GetClusterMetricsQuery {
  clusterName: string
}

export class GetTenantMetricsQuery {
  env: string
  clusterName: string
  clusterId: string
}

export class GetTenantMetricsResponse {
  cpu: Usage
  memory: Usage
}

export class GetProjectMetricsQuery {
  env: string
  clusterName: string
  clusterId: string
}

export class GetProjectMetricsResponse {
  cpu: Usage
  memory: Usage
}

export class GetClusterMetricsResponse {
  cpu: Usage
  memory: Usage
}
