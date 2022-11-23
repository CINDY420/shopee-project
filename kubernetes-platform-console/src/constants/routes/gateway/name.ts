import { GATEWAY_ID, TENANT_ID, PROJECT_ID, RESOURCE_ID, CLUSTER_ID } from '../identifier'
import { TENANT, PROJECT, RESOURCE, CLUSTER, buildName } from 'constants/routes/name'

export const GATEWAY = `gateways/:${GATEWAY_ID}`

export const LOAD_BALANCE = 'gateways/Load Balance'
export const INGRESS = 'gateways/Ingress'

export const GATEWAY_SERVICES_TENANT = `${GATEWAY}/${TENANT}`
export const GATEWAY_SERVICES_PROJECT = `${GATEWAY}/${PROJECT}`
export const GATEWAY_INGRESS = `${GATEWAY}/${CLUSTER}`

export const GATEWAY_LOAD_BALANCE_RESOURCE = `${GATEWAY}/${RESOURCE}`
export const GIT_TEMPLATE_RENDER = `${LOAD_BALANCE}/resources/Git Template Render`

export const buildGatewayName = ({ gatewayType }) =>
  buildName(GATEWAY, {
    [GATEWAY_ID]: gatewayType
  })

export const buildGatewayGroupName = ({ gatewayType, tenantId }) =>
  buildName(GATEWAY_SERVICES_TENANT, {
    [GATEWAY_ID]: gatewayType,
    [TENANT_ID]: tenantId
  })

export const buildGatewayProjectName = ({ gatewayType, tenantId, projectName }) =>
  buildName(GATEWAY_SERVICES_PROJECT, {
    [GATEWAY_ID]: gatewayType,
    [TENANT_ID]: tenantId,
    [PROJECT_ID]: projectName
  })

export const buildGatewayLoadBalanceResourceName = ({ gatewayType, resourceName }) =>
  buildName(GATEWAY_LOAD_BALANCE_RESOURCE, {
    [GATEWAY_ID]: gatewayType,
    [RESOURCE_ID]: resourceName
  })

export const buildIngressName = ({ gatewayType, clusterName }) =>
  buildName(GATEWAY_INGRESS, {
    [GATEWAY_ID]: gatewayType,
    [CLUSTER_ID]: clusterName
  })
