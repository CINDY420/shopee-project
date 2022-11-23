export enum ESIndex {
  USER = 'platform-backend-user',
  USER_DEPARTMENT = 'platform-backend-user-department',
  USER_WHITE_LIST = 'platform-backend-user-whitelist',
  // CLUSTER = 'platform-backend-cluster-v2',
  CLUSTER = 'platform-backend-cluster-v4',
  // CLUSTER_RESOURCE = 'platform-backend-cluster-resource-v2',
  CLUSTER_RESOURCE = 'platform-backend-cluster-resource-v4',
  RBAC = 'platform-backend-rbac',
  // PROJECT_QUOTAS = 'platform-backend-project-quotas-v2',
  PROJECT_QUOTAS = 'platform-backend-project-quotas-v4',
  // CLUSTER_INFO_DETAIL = 'platform-backend-cluster-info-detail',
  CLUSTER_INFO_DETAIL = 'platform-backend-cluster-info-detail-v4',
  // PROJECT = 'platform-backend-project',
  PROJECT = 'platform-backend-project-v4',
  // PROJECT_USAGE = 'platform-backend-project-usage',
  PROJECT_USAGE = 'platform-backend-project-usage-v4',
  PROJECT_WHITE_LIST = 'platform-backend-project-whitelist',
  // APPLICATION = 'platform-backend-application',
  APPLICATION = 'platform-backend-application-v4',
  // APPLICATION_TEMPLATE = 'platform-backend-application-template',
  APPLICATION_TEMPLATE = 'platform-backend-application-template',
  // APPLICATION_CONFIG = 'platform-backend-application-config',
  APPLICATION_CONFIG = 'platform-backend-application-config',
  INGRESS = 'platform-backend-ingress',
  USER_LOG = 'platform-backend-userlog-v3',
  // NODE = 'platform-backend-cluster-node',
  NODE = 'platform-backend-cluster-node-v4',
  INGRESS_V3 = 'platform-backend-ingress-v3',
  AUTH_V2 = 'platform-backend-auth-v2',
  // POD = 'platform-backend-pod',
  POD = 'platform-backend-pod-v4',
  // EVENT = 'platform-backend-cluster-event',
  EVENT = 'platform-backend-cluster-event',
  DOMAIN = 'platform-backend-domain',
  DOMAIN_GROUP = 'platform-backend-domain-group',
  TERMINAL_LOG = 'platform-backend-termlog-v4',
  BOT = 'platform-backend-bot',
  TICKET = 'platform-backend-ticket',
  AUTH_POLICY = 'platform-backend-auth-policy',
  RELEASE_FREEZE_POLICY = 'platform-backend-release-freeze',
  PROF_DESCRIPTOR = 'platform-backend-prof-descriptor-v4',
  TERMINAL_REPLAY = 'platform-backend-terminal-replay'
}

export const ES_DEFAULT_COUNT = 10
// for getting all of the items in es (assume the total can not be bigger than 10000)
export const ES_MAX_SEARCH_COUNT = 10000
export const ES_DEFAULT_OFFSET = 0
export const ES_SUPER_MAX_SEARCH_COUNT = 1000000
interface Explanation {
  value: number
  description: string
  details: Explanation[]
}

interface ShardsResponse {
  total: number
  successful: number
  failed: number
  skipped: number
}

export interface SearchResponseHit<T = unknown> {
  _index: string
  _type: string
  _id: string
  _score: number
  _source: T
  _version?: number
  _explanation?: Explanation
  fields?: any
  highlight?: any
  inner_hits?: any
  matched_queries?: string[]
  sort?: string[]
}

export interface SearchResponse<T> {
  took: number
  timed_out: boolean
  _scroll_id?: string
  _shards: ShardsResponse
  hits: {
    total: {
      relation: string
      value: number
    }
    max_score: number
    hits: Array<SearchResponseHit<T>>
  }
  aggregations?: any
}

export interface IndexResponse {
  _index: string
  _type: string
  _id: string
  _version: number
  result: string
  _shards: {
    total: number
    successful: number
    failed: number
  }
  _seq_no: number
  _primary_term: number
}

export interface ICountResponse {
  count: number
  _shards: {
    total: number
    successful: number
    skipped: number
    failed: number
  }
}
