import { SCOPE, CONTAINER } from 'src/constants/config'

const ROOT = `/${SCOPE}/${CONTAINER}`

// Cluster
export const CLUSTER = `${ROOT}/cluster`
export const CREATE_CLUSTER = `${CLUSTER}/create`
export const CLUSTER_DETAIL = `${CLUSTER}/:clusterId`

export const DEFAULT_ROUTE = CLUSTER

export const buildProvisioningHistoryRoute = (clusterId: number | string) =>
  `${CLUSTER}/${clusterId}?selectedTab=Provisioning%20History`
// Permissions
export const NO_PERMISSION = `${ROOT}/noPermission`

export const EVENT = `${CLUSTER_DETAIL}/events/: eventId`

// Secret
// secret has no id, the id is joined by secretName and namespace in such format ${namespace}===${secretName}. Refer to 'helpers/route'
export const SECRET_DETAIL = `${CLUSTER_DETAIL}/secret/:secretId`
