export interface IOpenApiConfig {
  protocol: 'http' | 'https'
  host: string
  port?: number
  prefix?: string
}

export interface IConfig {
  ['http-timeout']: number
  openApi: IOpenApiConfig
}

export interface ISreTicketConfig {
  protocol: 'http' | 'https'
  host: string
  token: string
  prefix?: string
}

export interface IMetricsConfig {
  protocol: 'http' | 'https'
  host: string
  port?: number
  token: string
  prefix?: string
  clusterName: string
}
