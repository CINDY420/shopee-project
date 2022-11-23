import { GATEWAY_ID, TENANT_ID, PROJECT_ID, DOMAIN_GROUP_ID, DOMAIN_ID, CLUSTER_ID } from '../identifier'
import { TENANT, PROJECT, RESOURCE, CLUSTER } from '../name'
import { buildRoute } from '../routes'

export const GATEWAYS = '/gateways'

export const GATEWAY_SERVICES = `${GATEWAYS}/Services`
export const GATEWAY_LOAD_BALANCE = `${GATEWAYS}/Load Balance`
export const GATEWAY_INGRESS = `${GATEWAYS}/Ingress`

export const GATEWAY = `${GATEWAYS}/:${GATEWAY_ID}`
export const GATEWAY_SERVICES_GROUP_DETAIL = `${GATEWAY_SERVICES}/${TENANT}`
export const GATEWAY_SERVICES_PROJECT_DETAIL = `${GATEWAY_SERVICES}/${PROJECT}`
export const GATEWAY_INGRESS_LIST = `${GATEWAY_INGRESS}/${CLUSTER}`
export const GATEWAY_DOMAIN_GROUP = `${GATEWAYS}/:${GATEWAY_ID}/domainGroups/:${DOMAIN_GROUP_ID}`
export const GATEWAY_DOMAIN = `${GATEWAY_DOMAIN_GROUP}/clusters/:${CLUSTER_ID}/domains/:${DOMAIN_ID}`

export const GATEWAY_LOAD_BALANCE_RESOURCE = `${GATEWAY_LOAD_BALANCE}/${RESOURCE}`
export const GATEWAY_LOAD_BALANCE_GIT_TEMPLATE_RENDER = `${GATEWAY_LOAD_BALANCE}/resources/Git Template Render`

export const LOAD_BALANCE_DOMAIN_GROUP = `${GATEWAYS}/Load Balance/domainGroups`
export const GATEWAY_LOAD_BALANCE_DOMAIN_GROUP = `${LOAD_BALANCE_DOMAIN_GROUP}/:${DOMAIN_GROUP_ID}`
export const GATEWAY_LOAD_BALANCE_DOMAIN = `${GATEWAY_LOAD_BALANCE_DOMAIN_GROUP}/Clusters/:${CLUSTER_ID}/Domains/:${DOMAIN_ID}`

export const buildGatewayGroupRoute = ({ gatewayType, tenantId }) =>
  buildRoute(GATEWAY_SERVICES_GROUP_DETAIL, {
    [GATEWAY_ID]: gatewayType,
    [TENANT_ID]: tenantId
  })

export const buildGatewayProjectRoute = ({ gatewayType, tenantId, projectName }) =>
  buildRoute(GATEWAY_SERVICES_PROJECT_DETAIL, {
    [GATEWAY_ID]: gatewayType,
    [TENANT_ID]: tenantId,
    [PROJECT_ID]: projectName
  })

export const buildLoadBalanceDomainGroupRoute = ({ domainGroupId }) =>
  buildRoute(GATEWAY_LOAD_BALANCE_DOMAIN_GROUP, {
    [DOMAIN_GROUP_ID]: domainGroupId
  })

export const buildGatewayLoadBalanceDomainRoute = ({ domainGroupName, domainName, clusterName }) =>
  buildRoute(GATEWAY_LOAD_BALANCE_DOMAIN, {
    [GATEWAY_ID]: 'Load Balance',
    [DOMAIN_GROUP_ID]: domainGroupName,
    [DOMAIN_ID]: domainName,
    [CLUSTER_ID]: clusterName
  })
