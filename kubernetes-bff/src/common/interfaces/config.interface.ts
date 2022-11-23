export interface IEsConfig {
  protocol: string
  host: string
  port?: string
}

export interface IAgentConfig {
  protocol: string
  host: string
  port?: string
}

export interface ClusterConfig {
  clusterName: string
  config: string
}

export interface IMetricsConfig {
  protocol: string
  host: string
  port?: string
}

export interface IMailerConfig {
  server: string
  port: string
}

export interface IUserGroupConfig {
  Id: number
  Name: string
  Approver: string
}

export interface IDeleteDeploymentConfig {
  allowDeleteClusters: string[]
  prohibitDeleteProjects: string[]
}

export interface IGlobalConfig {
  groups: string[]
  envs: string[]
  cids: string[]
  localSession: string
  UserGroupAdmin: string[]
  userGroupConfig: IUserGroupConfig[]
  podContainerNameRegex: string[]
  livePodExec: boolean
  oamApplications: string[]
  settings: string
  terminalAudit: boolean
  deleteDeploymentConfig: IDeleteDeploymentConfig
}

interface ISpecificBot {
  id: number
  ttl: number
  limit: number
}

interface IRateLimit {
  ttl: number
  limit: number
  specificBots: ISpecificBot[]
}

export interface ISkeBffConfig {
  rateLimit: IRateLimit
}

interface IQueryFilter {
  [key: string]: string
}

interface ITermQuery {
  [key: string]: {
    value: string
  }
}

interface QueryValueRangeValue {
  gte?: string
  lte?: string
}

interface IQueryValue {
  term?: IQueryFilter | ITermQuery
  match?: IQueryFilter
  wildcard?: IQueryFilter
  range?: Record<string, QueryValueRangeValue>
}

export interface IEsBooleanQuery {
  must?: any
  filter?: IQueryValue | IQueryValue[]
  mustNot?: any
  minimumShouldMatch?: number
  boost?: number
  should?: any
}

export interface IEsAggregateBucket {
  key: string
  doc_count: number
}

export interface IEsAggregateResponse {
  buckets: IEsAggregateBucket[]
}
