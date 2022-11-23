import {
  PROJECT_ID,
  TENANT_ID,
  JOB_ID,
  CLUSTER_ID,
  PERIODIC_JOB_ID,
} from 'constants/routes/identifier'
export const ROOT = '/'
export const LOGIN = '/login'

export const REDIRECT_QUERY_KEY = 'redirect'

export const PROJECT_MGT = '/projectManagement'
export const TENANT = `${PROJECT_MGT}/tenants/:${TENANT_ID}`
export const PROJECT = `${TENANT}/projects/:${PROJECT_ID}`
export const JOB = `${PROJECT}/jobs/:${JOB_ID}`
export const CREATE_JOB = `${PROJECT}/createJob`
export const EDIT_JOB = `${JOB}/edit`
export const CREATE_PERIODIC_JOB = `${PROJECT}/createPeriodicJob`
export const EDIT_PERIODIC_JOB = `${PROJECT}/periodicJobs/:${PERIODIC_JOB_ID}/edit`
export const PERIODIC_JOB = `${PROJECT}/periodicJobs/:${PERIODIC_JOB_ID}`
export const PERIODIC_INSTANCE = `${PERIODIC_JOB}/instance/:${JOB_ID}`

export const DEFAULT_ROUTE = PROJECT_MGT

export const PLATFORMS = '/platform'
export const TENANTS = '/tenant'
export const ACCESS_APPLY = '/accessApply'
export const CLUSTER_MANAGEMENT = '/clusterManagement'
export const OPERATION_HISTORY = '/operationHistory'
export const CLUSTER = `${CLUSTER_MANAGEMENT}/cluster/:${CLUSTER_ID}`
export const RESOURCE_PANEL = '/resourcePanel'
export const TENANT_RESOURCE_PANEL = `/resourcePanel/tenants/:${TENANT_ID}`
