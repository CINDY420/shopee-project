import {
  TENANT,
  PROJECT,
  APPLICATION,
  POD,
  INGRESS,
  SERVICE,
  DEPLOYMENT,
  PIPELINE_RUNNING,
  PIPELINE_HISTORIES,
  EDITPIPELINE
} from './name'
import {
  TENANT_ID,
  PROJECT_ID,
  APPLICATION_ID,
  DEPLOYMENT_ID,
  CLUSTER_ID,
  POD_ID,
  NODE_ID,
  PIPELINE_NAME,
  PIPELINE_RUNNING_ID,
  PROFILE_ID
} from './identifier'

export const ROOT = '/'
export const LOGIN = '/login'

export const PLATFORM = '/platform'
export const CLUSTERS = PLATFORM + '/clusters'
export const CLUSTER_DETAIL = CLUSTERS + '/:clusterId'
export const NODE_DETAIL: string = CLUSTER_DETAIL + '/nodes/:nodeId'
export const PLATFORMS = PLATFORM + '/platforms'
export const TENANTS = PLATFORM + '/tenants'
export const RESOURCE = PLATFORM + '/resource'

export const APPLICATIONS = '/applications'
export const INGRESSES = '/ingresses'
export const PIPELINES = '/pipelines'
export const PIPELINES_LIST = PIPELINES + '/tenants'
export const PIPELINE_OVERVIEW = `${PIPELINES}/${TENANT}`
export const CREATE_PIPELINE = PIPELINE_OVERVIEW + '/create'
export const EDIT_PIPELINE = `${PIPELINES}/${EDITPIPELINE}`
export const PIPELINE_DETAIL = `${PIPELINES}/${PIPELINE_HISTORIES}`
export const PIPELINE_RUN = `${PIPELINES}/${PIPELINE_RUNNING}`
export const RELEASE_FREEZES = `${PLATFORM}/releaseFreezes`

export const DEFAULT_ROUTE: string = APPLICATIONS

export const TENANT_DETAIL = `${APPLICATIONS}/${TENANT}`
export const PROJECT_DETAIL = `${APPLICATIONS}/${PROJECT}`
export const PROJECT_CREATE = `${APPLICATIONS}/${TENANT}/create`
export const PROJECT_EDIT = `${APPLICATIONS}/${PROJECT}/edit`
export const APPLICATION_DETAIL = `${APPLICATIONS}/${APPLICATION}`
export const INGRESS_DETAIL = `${APPLICATIONS}/${INGRESS}`
export const SERVICE_DETAIL = `${APPLICATIONS}/${SERVICE}`
export const POD_DETAIL = `${APPLICATIONS}/${POD}`
export const POD_FLAME_GRAPH = `${POD_DETAIL}/profiles/:${PROFILE_ID}/flameGraph`

export const DEPLOYMENT_DETAIL = `${APPLICATIONS}/${DEPLOYMENT}`
export const APPLICATIONS_NOT_FOUND: string = APPLICATIONS + '/404'

export const REDIRECT_QUERY_KEY = 'redirect'

export const APPROVALS = '/approvals'
export const APPROVAL_ID = 'approvalId'
export const APPROVAL_DETAIL = `${APPROVALS}/:${APPROVAL_ID}`

export const REQUESTS = '/requests'
export const REQUESTS_ID = 'requestId'
export const REQUESTS_DETAIL = `${REQUESTS}/:${REQUESTS_ID}`

export const OPERATION_LOGS = '/operationLogs'

export const GATEWAYS = '/gateways'

export const ACCESS_REQUEST = '/accessRequest'

export const RBAC_ACTION_KEY = 'RBACActionType'

export const TICKET_CENTER_KEY = 'ticketsCenter'
export const TICKET_CENTER = `/${TICKET_CENTER_KEY}`

export const PENDING_MY_ACTION = 'pendingMyAction'
export const MY_REQUESTS = 'myRequests'
export const PENDING_MY_ACTION_LIST = `${TICKET_CENTER}/${PENDING_MY_ACTION}`
export const MY_REQUESTS_LIST = `${TICKET_CENTER}/${MY_REQUESTS}`

export const TICKET_LIST_TYPE = 'ticketListType'
export const TICKET_LIST_KEY = `${TICKET_CENTER_KEY}/:${TICKET_LIST_TYPE}`
export const TICKET_LIST = `${TICKET_CENTER}/:${TICKET_LIST_TYPE}`

export const TICKET_ID = 'ticketId'
export const TICKET_DETAIL_KEY = 'ticketDetail'
export const TICKET_DETAIL = `${TICKET_LIST}/${TICKET_DETAIL_KEY}/:${TICKET_ID}`

export const buildRoute = (pathTemplate: string, configs: { [id: string]: string }): string => {
  let result = pathTemplate
  Object.entries(configs).forEach(([id, str]) => {
    result = result.replace(`:${id}`, str)
  })

  return result
}

export const buildGroupDetailRoute = ({ tenantId }) =>
  buildRoute(TENANT_DETAIL, {
    [TENANT_ID]: tenantId
  })

export const buildProjectDetailRoute = ({ tenantId, projectName }) =>
  buildRoute(PROJECT_DETAIL, {
    [TENANT_ID]: tenantId,
    [PROJECT_ID]: projectName
  })

export const buildApplicationDetailRoute = ({ tenantId, projectName, applicationName }) =>
  buildRoute(APPLICATION_DETAIL, {
    [TENANT_ID]: tenantId,
    [PROJECT_ID]: projectName,
    [APPLICATION_ID]: applicationName
  })

export const buildDeployDetailRoute = ({ tenantId, projectName, applicationName, deployName, clusterId }) =>
  buildRoute(DEPLOYMENT_DETAIL, {
    [TENANT_ID]: tenantId,
    [PROJECT_ID]: projectName,
    [APPLICATION_ID]: applicationName,
    [DEPLOYMENT_ID]: deployName,
    [CLUSTER_ID]: clusterId
  })

export const buildPodDetailRoute = ({ tenantId, projectName, applicationName, deployName, clusterName, podName }) =>
  buildRoute(POD_DETAIL, {
    [TENANT_ID]: tenantId,
    [PROJECT_ID]: projectName,
    [APPLICATION_ID]: applicationName,
    [DEPLOYMENT_ID]: deployName,
    [CLUSTER_ID]: clusterName,
    [POD_ID]: podName
  })

export const buildNodeDetailRoute = ({ clusterName, nodeName }) =>
  buildRoute(NODE_DETAIL, {
    [CLUSTER_ID]: clusterName,
    [NODE_ID]: nodeName
  })

export const buildPipelineRoute = ({ tenantId }) =>
  buildRoute(PIPELINES, {
    [TENANT_ID]: tenantId
  })

export const buildPipelineDetailRoute = ({ tenantId, pipelineName }) =>
  buildRoute(PIPELINE_DETAIL, {
    [TENANT_ID]: tenantId,
    [PIPELINE_NAME]: pipelineName
  })

export const buildPipelineRunRoute = ({ tenantId, pipelineName, runId }) =>
  buildRoute(PIPELINE_RUN, {
    [TENANT_ID]: tenantId,
    [PIPELINE_NAME]: pipelineName,
    [PIPELINE_RUNNING_ID]: runId
  })

export const buildFlameGraphRoute = ({
  tenantId,
  projectName,
  applicationName,
  deployName,
  clusterId,
  podName,
  profileId
}) =>
  buildRoute(POD_FLAME_GRAPH, {
    [TENANT_ID]: tenantId,
    [PROJECT_ID]: projectName,
    [APPLICATION_ID]: applicationName,
    [DEPLOYMENT_ID]: deployName,
    [CLUSTER_ID]: clusterId,
    [POD_ID]: podName,
    [PROFILE_ID]: profileId
  })
