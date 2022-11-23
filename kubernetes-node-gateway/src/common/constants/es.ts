export enum ES_INDEX {
  USER = 'platform-backend-user',
  USER_DEPARTMENT = 'platform-backend-user-department',
  USER_WHITE_LIST = 'platform-backend-user-whitelist',
  CLUSTER = 'platform-backend-cluster-v4',
  CLUSTER_RESOURCE = 'platform-backend-cluster-resource-v4',
  RBAC = 'platform-backend-rbac',
  PROJECT_QUOTAS = 'platform-backend-project-quotas-v4',
  CLUSTER_INFO_DETAIL = 'platform-backend-cluster-info-detail-v4',
  PROJECT = 'platform-backend-project-v4',
  PROJECT_USAGE = 'platform-backend-project-usage-v4',
  PROJECT_WHITE_LIST = 'platform-backend-project-whitelist',
  APPLICATION = 'platform-backend-application-v4',
  APPLICATION_TEMPLATE = 'platform-backend-application-template',
  APPLICATION_CONFIG = 'platform-backend-application-config',
  INGRESS = 'platform-backend-ingress',
  USER_LOG = 'platform-backend-userlog-v3',
  NODE = 'platform-backend-cluster-node-v4',
  INGRESS_V3 = 'platform-backend-ingress-v3',
  AUTH_V2 = 'platform-backend-auth-v2',
  POD = 'platform-backend-pod-v4',
  EVENT = 'platform-backend-cluster-event',
  DOMAIN = 'platform-backend-domain',
  DOMAIN_GROUP = 'platform-backend-domain-group',
  TERMINAL_LOG = 'platform-backend-termlog-v4',
  BOT = 'platform-backend-bot',
  TICKET = 'platform-backend-ticket',
  AUTH_POLICY = 'platform-backend-auth-policy',
  RELEASE_FREEZE_POLICY = 'platform-backend-release-freeze',
  PROF_DESCRIPTOR = 'platform-backend-prof-descriptor-v4',
  TERMINAL_REPLAY = 'platform-backend-terminal-replay',
}

export const ES_ORDER_ASCEND = 'asc'
export const ES_ORDER_DESCEND = 'desc'
export const ES_DEFAULT_OFFSET = 0
export const ES_DEFAULT_COUNT = 10
export const ES_MAX_COUNT = 10000
