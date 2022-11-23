export enum RBAC_ROLES {
  BOSS = 'Boss',
  OTHERS = 'Others',
  SRE = 'SRE',
  DEVOPS = 'Devops',
  QA = 'QA',
  MANAGER = 'Manager',
}

export enum PERMISSION_GROUP {
  PLATFORM_ADMIN = 2000,
  TENANT_ADMIN = 2001,
  LIVE_OPERATOR = 2002,
}

export enum GLOBAL_RESOURCES {
  CODE_FREEZE = 'codeFreeze',
  GROUP_QUOTA = 'groupQuota',
  USER_LOG = 'userLog',
  AUTH = 'auth',
  CLUSTER_TAB = 'clusterTab',
}

export enum GROUP_RESOURCES {
  PIPELINE = 'pipeline',
  PROJECT_QUOTA = 'projectQuota',
  PROJECT = 'project',
  APPLICATION = 'application',
  INGRESS = 'ingress',
  POD = 'pod',
  FTE = 'fte',
  DEPLOY = 'deploy',
  SERVICE = 'service',
  TERMINAL_ACCESS = 'terminalAccess',
  INITIAL_ACCESS = 'initialAccess',
  CHANGE_ROLE = 'changeRole',
  ADD_ROLE = 'addRole',
}

export enum ACCESS_CONTROL_VERBS {
  VIEW = 'View',
  VIEW_APPLY = 'ViewApply',
  VIEW_APPROVE = 'ViewApprove',
  CREATE = 'Create',
  EDIT = 'Edit',
  DELETE = 'Delete',
  LIST = 'List',
  EXECUTE = 'Execute',
  GET_DETAILS = 'GetDetails',
  GET_HISTORY = 'GetHistory',
  EXECUTE_LIVE = 'ExecuteLive',
  EXECUTE_LIVE_CODE_FREEZE = 'ExecuteLiveCodeFreeze',
  DELETE_LIVE = 'DeleteLive',
  EDIT_LIVE = 'EditLive',
  EDIT_CONFIG = 'EditConfig',
}

// read and update verb
export const RU_VERBS = [ACCESS_CONTROL_VERBS.VIEW, ACCESS_CONTROL_VERBS.EDIT]
// verbs for pod resource
export const POD_VERBS = [ACCESS_CONTROL_VERBS.DELETE, ACCESS_CONTROL_VERBS.DELETE_LIVE]
// verbs for deploy resource
export const DEPLOY_VERBS = [ACCESS_CONTROL_VERBS.EDIT, ACCESS_CONTROL_VERBS.EDIT_LIVE]
// common crud verbs collection
export const CRUD_VERBS = [
  ACCESS_CONTROL_VERBS.CREATE,
  ACCESS_CONTROL_VERBS.VIEW,
  ACCESS_CONTROL_VERBS.EDIT,
  ACCESS_CONTROL_VERBS.DELETE,
]
export const ACCESS_REQUEST_VERBS = [ACCESS_CONTROL_VERBS.VIEW_APPLY, ACCESS_CONTROL_VERBS.VIEW_APPROVE]
// pipeline verbs
export const PIPELINE_VERBS = [
  ACCESS_CONTROL_VERBS.LIST,
  ACCESS_CONTROL_VERBS.DELETE,
  ACCESS_CONTROL_VERBS.EXECUTE,
  ACCESS_CONTROL_VERBS.GET_DETAILS,
  ACCESS_CONTROL_VERBS.EDIT,
  ACCESS_CONTROL_VERBS.GET_HISTORY,
  ACCESS_CONTROL_VERBS.EXECUTE_LIVE,
  ACCESS_CONTROL_VERBS.EXECUTE_LIVE_CODE_FREEZE,
]
// verbs for env resource
export const ENV_VERBS = [
  ACCESS_CONTROL_VERBS.CREATE,
  ACCESS_CONTROL_VERBS.LIST,
  ACCESS_CONTROL_VERBS.DELETE,
  ACCESS_CONTROL_VERBS.EDIT,
]
// verbs for application resource
export const APPLICATION_VERBS = [...CRUD_VERBS, ACCESS_CONTROL_VERBS.EDIT_CONFIG]

// hard code
export const CODE_FREEZE_ADMINS = ['fei.hou@shopee.com', 'shuanglai.xing@shopee.com']

export const RBAC_GLOBAL_RESOURCE_ACTION_META_KEY = 'rbac_global_resource_verb'
export const RBAC_TENANT_RESOURCE_ACTION_META_KEY = 'rbac-tenant_resource_action'

export const UNAUTHORIZED_USER_MAIN_DEPARTMENT = -1

export enum FORBIDDEN_ERROR_CODE {
  NEED_APPLY_FOR_GROUP_AND_ROLE = '101',
}

export enum RESOURCE_TYPE {
  CLUSTER = 'Cluster',
  CLUSTER_QUOTA = 'ClusterQuota',
  NODE = 'Node',
  TENANT = 'Tenant',
  GLOBAL_USER = 'GlobalUser',
  GLOBAL_BOT = 'GlobalBot',
  OPERATION_LOG = 'OperationLog',
  TERMINAL_TICKET = 'TerminalTicket',
  ACCESS_TICKET = 'AccessTicket',
  TENANT_USER = 'TenantUser',
  TENANT_BOT = 'TenantBot',
  PROJECT_QUOTA = 'ProjectQuota',
  PROJECT = 'Project',
  APPLICATION = 'Application',
  APPLICATION_DEPLOY_CONFIG = 'Application/DeployConfig',
  SERVICE = 'Service',
  INGRESS = 'Ingress',
  DEPLOYMENT = 'Deployment',
  POD = 'Pod',
  POD_TERMINAL = 'Pod/Terminal',
  PIPELINE = 'Pipeline',
  RELEASE_FREEZE = 'ReleaseFreeze',
  OPS = 'OPS',
  HPA_RULES = 'HPARules',
  HPA_CONTROLLER = 'HPAController',
  ZONE = 'Zone',
}

export enum PERMISSION_SCOPE {
  GLOBAL = 'GLOBAL',
  TENANT = 'TENANT',
}

export const PermissionEnvMap = {
  Live: 'Live',
  'Non-Live': 'NonLive',
}

export enum RESOURCE_ACTION {
  ADD = 'Add',
  VIEW = 'View',
  DELETE = 'Delete',
  EDIT = 'Edit',
  CREATE = 'Create',
  STOP = 'Stop',
  UNBIND = 'Unbind',
  LABEL = 'Label',
  DRAIN = 'Drain',
  CORDON = 'Cordon',
  TAINT = 'Taint',
  TRANSFER = 'Transfer',
  UNCORDON = 'Uncordon',
  BATCH_LABEL = 'BatchLabel',
  BATCH_DRAIN = 'BatchDrain',
  BATCH_CORDON = 'BatchCordon',
  BATCH_TAINT = 'BatchTaint',
  BATCH_UNCORDON = 'BatchUncordon',
  SCALE_LIVE = 'ScaleLive',
  ROLLBACK_LIVE = 'RollbackLive',
  FULL_RELEASE_LIVE = 'FullReleaseLive',
  ROLLOUT_RESTART_LIVE = 'RolloutRestartLive',
  CANCEL_CANARY_LIVE = 'CancelCanaryLive',
  EDIT_RESOURCE_LIVE = 'EditResourceLive',
  BATCH_SCALE_LIVE = 'BatchScaleLive',
  BATCH_FULL_RELEASE_LIVE = 'BatchFullReleaseLive',
  BATCH_ROLLOUT_RESTART_LIVE = 'BatchRolloutRestartLive',
  SCALE_NON_LIVE = 'ScaleNonLive',
  ROLLBACK_NON_LIVE = 'RollbackNonLive',
  FULL_RELEASE_NON_LIVE = 'FullReleaseNonLive',
  ROLLOUT_RESTART_NON_LIVE = 'RolloutRestartNonLive',
  CANCEL_CANARY_NON_LIVE = 'CancelCanaryNonLive',
  EDIT_RESOURCE_NON_LIVE = 'EditResourceNonLive',
  BATCH_SCALE_NON_LIVE = 'BatchScaleNonLive',
  BATCH_FULL_RELEASE_NON_LIVE = 'BatchFullReleaseNonLive',
  BATCH_ROLLOUT_RESTART_NON_LIVE = 'BatchRolloutRestartNonLive',
  KILL_LIVE = 'KillLive',
  BATCH_KILL_LIVE = 'BatchKillLive',
  KILL_NON_LIVE = 'KillNonLive',
  BATCH_KILL_NON_LIVE = 'BatchKillNonLive',
  APPROVE = 'Approve',
  APPROVE_LIVE = 'ApproveLive',
  VIEW_LIVE = 'ViewLive',
  VIEW_NON_LIVE = 'ViewNonLive',
  DELETE_LIVE = 'DeleteLive',
  DELETE_NON_LIVE = 'DeleteNonLive',
  // for pipeline
  CREATE_NON_LIVE = 'CreateNonLive',
  EDIT_NON_LIVE = 'EditNonLive',
  RUN_NON_LIVE = 'RunNonLive',
  REBUILD_NON_LIVE = 'RebuildNonLive',
  ABORT_NON_LIVE = 'AbortNonLive',
  CREATE_LIVE = 'CreateLive',
  EDIT_LIVE = 'EditLive',
  RUN_LIVE = 'RunLive',
  REBUILD_LIVE = 'RebuildLive',
  ABORT_LIVE = 'AbortLive',
  MOVE = 'Move',
  IMPORT = 'Import',
  MIGRATE = 'Migrate',
  BATCH_MIGRATE = 'BatchMigrate',
  // for ops
  BATCH_EDIT = 'BatchEdit',
  BATCH_DELETE = 'BatchDelete',
  ADD_NEW_ESTIMATES = 'AddNewEstimates',
  BATCH_ADD_NEW_ESTIMATES = 'BatchAddNewEstimates',
  // for hpa
  COPY = 'Copy',
}

export const PLATFORM_ROLE_SCOPE = 0 // global user scope
export const PLATFORM_TENANT_ID = 0 // global tenant id
