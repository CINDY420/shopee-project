import { SCOPE, CONTAINER } from 'src/constants/config'

const ROOT = `/${SCOPE}/${CONTAINER}`

// Cluster
export const CLUSTER = `${ROOT}/cluster`
export const ADD_EKS_CLUSTER = `${CLUSTER}/addEks`
export const ADD_OTHER_CLUSTER = `${CLUSTER}/addOther`

export const CLUSTER_DETAIL = `${CLUSTER}/:clusterId`

// Tenant
export const TENANT = `${ROOT}/tenant`

// Segment
export const SEGMENT = `${ROOT}/segment`
export const SEGMENT_LIST = `${SEGMENT}/segments`
export const SEGMENT_DETAIL = `${SEGMENT_LIST}/:segmentId`

export const DEFAULT_ROUTE = CLUSTER
