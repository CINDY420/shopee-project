import {
  CLUSTER_ID,
  NODE_ID,
  TENANT_ID,
  PROJECT_ID,
  APPLICATION_ID,
  INGRESS_ID,
  SERVICE_ID,
  POD_ID,
  PIPELINE_NAME,
  PIPELINE_RUNNING_ID,
  APPROVAL_ID,
  REQUEST_ID,
  DEPLOYMENT_ID,
  GATEWAY_ID,
  RESOURCE_ID,
  TICKET_LIST_TYPE,
  TICKET_ID
} from './identifier'
import { PIPELINES } from './routes'

export const CLUSTER = `clusters/:${CLUSTER_ID}`
export const NODE = `${CLUSTER}/nodes/:${NODE_ID}`

export const TENANT = `tenants/:${TENANT_ID}`
export const PROJECT = `${TENANT}/projects/:${PROJECT_ID}`
export const APPLICATION = `${PROJECT}/applications/:${APPLICATION_ID}`
export const DEPLOYMENT = `${APPLICATION}/deploys/:${DEPLOYMENT_ID}/clusters/:${CLUSTER_ID}`
export const INGRESS = `${PROJECT}/clusters/:${CLUSTER_ID}/ingresses/:${INGRESS_ID}`
export const SERVICE = `${PROJECT}/clusters/:${CLUSTER_ID}/services/:${SERVICE_ID}`
export const POD = `${DEPLOYMENT}/pods/:${POD_ID}`
export const PIPELINE = `tenants/:${TENANT_ID}`
export const CREATEPIPELINE = `tenants/:${TENANT_ID}/create`
export const EDITPIPELINE = `${PIPELINE}/pipelines/:${PIPELINE_NAME}/edit`
export const PIPELINE_HISTORIES = `${PIPELINE}/pipelines/:${PIPELINE_NAME}`
export const PIPELINE_RUNNING = `${PIPELINE_HISTORIES}/runs/:${PIPELINE_RUNNING_ID}`
export const GATEWAY = `gateways/:${GATEWAY_ID}`
export const RESOURCE = `resources/:${RESOURCE_ID}`

export const APPROVAL = `approvals/:${APPROVAL_ID}`
export const REQUEST = `requests/:${REQUEST_ID}`

export const APPROVAL_AND_REQUEST = `ticketsCenter/:${TICKET_LIST_TYPE}`
export const TICKET = `${APPROVAL_AND_REQUEST}/ticketDetail/:${TICKET_ID}`

export const buildName = (nameTemplate: string, configs: { [id: string]: string | number }): string => {
  let result = nameTemplate
  Object.entries(configs).forEach(([id, str]) => {
    result = result.replace(`:${id}`, String(str))
  })
  return result
}

export const buildTenantName = (tenantId: number) =>
  buildName(TENANT, {
    [TENANT_ID]: tenantId
  })
export const buildProjectName = (tenantId: number, projectName: string) =>
  buildName(PROJECT, {
    [TENANT_ID]: tenantId,
    [PROJECT_ID]: projectName
  })
export const buildApplicationName = (tenantId: number, projectName: string, applicationName: string) =>
  buildName(APPLICATION, {
    [TENANT_ID]: tenantId,
    [PROJECT_ID]: projectName,
    [APPLICATION_ID]: applicationName
  })

export const buildDeploymentName = (
  tenantId: number,
  projectName: string,
  applicationName: string,
  deployName: string,
  clusterId: string
) =>
  buildName(DEPLOYMENT, {
    [TENANT_ID]: tenantId,
    [PROJECT_ID]: projectName,
    [APPLICATION_ID]: applicationName,
    [DEPLOYMENT_ID]: deployName,
    [CLUSTER_ID]: clusterId
  })

export const buildPipelineName = (tenantId: number) =>
  buildName(PIPELINE, {
    [TENANT_ID]: tenantId
  })

export const buildPipelineHistoriesName = (tenantId: number, pipelineName: string) => {
  return `${PIPELINES}/${buildName(PIPELINE_HISTORIES, {
    [TENANT_ID]: tenantId,
    [PIPELINE_NAME]: pipelineName
  })}`
}
