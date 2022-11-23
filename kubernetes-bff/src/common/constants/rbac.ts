export enum RBAC_ROLES {
  BOSS = 'Boss',
  OTHERS = 'Others',
  SRE = 'SRE',
  DEVOPS = 'Devops',
  QA = 'QA',
  MANAGER = 'Manager'
}

export enum PERMISSION_GROUP {
  PLATFORM_ADMIN = 2000,
  TENANT_ADMIN = 2001,
  LIVE_OPERATOR = 2002
}

export enum GLOBAL_RESOURCES {
  CODE_FREEZE = 'codeFreeze',
  GROUP_QUOTA = 'groupQuota',
  USER_LOG = 'userLog',
  AUTH = 'auth',
  CLUSTER_TAB = 'clusterTab'
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
  ADD_ROLE = 'addRole'
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
  EDIT_CONFIG = 'EditConfig'
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
  ACCESS_CONTROL_VERBS.DELETE
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
  ACCESS_CONTROL_VERBS.EXECUTE_LIVE_CODE_FREEZE
]
// verbs for env resource
export const ENV_VERBS = [
  ACCESS_CONTROL_VERBS.CREATE,
  ACCESS_CONTROL_VERBS.LIST,
  ACCESS_CONTROL_VERBS.DELETE,
  ACCESS_CONTROL_VERBS.EDIT
]
// verbs for application resource
export const APPLICATION_VERBS = [...CRUD_VERBS, ACCESS_CONTROL_VERBS.EDIT_CONFIG]

// hardecode
export const CODE_FREEZE_ADMINS = ['fei.hou@shopee.com', 'shuanglai.xing@shopee.com']

export const RBAC_GLOBAL_RESOURCE_ACTION_META_KEY = 'rbac_global_resource_verb'
export const RBAC_TENANT_RESOURCE_ACTION_META_KEY = 'rbac-tenant_resource_action'

export const UNAUTHORIZED_USER_MAIN_DEPARTMENT = -1

export enum ForbiddenErrorCode {
  NEED_APPLY_FOR_GROUP_AND_ROLE = '101'
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
  RELEASE_FREEZE = 'ReleaseFreeze'
}

export enum PERMISSION_SCOPE {
  GLOBAL = 'GLOBAL',
  TENANT = 'TENANT'
}

export const PermissionEnvMap = {
  Live: 'Live',
  'Non-Live': 'NonLive'
}

export enum RESOURCE_ACTION {
  Add = 'Add',
  View = 'View',
  Delete = 'Delete',
  Edit = 'Edit',
  Create = 'Create',
  Stop = 'Stop',
  Unbind = 'Unbind',
  Label = 'Label',
  Drain = 'Drain',
  Cordon = 'Cordon',
  Taint = 'Taint',
  Transfer = 'Transfer',
  Uncordon = 'Uncordon',
  BatchLabel = 'BatchLabel',
  BatchDrain = 'BatchDrain',
  BatchCordon = 'BatchCordon',
  BatchTaint = 'BatchTaint',
  BatchUncordon = 'BatchUncordon',
  ScaleLive = 'ScaleLive',
  RollbackLive = 'RollbackLive',
  FullReleaseLive = 'FullReleaseLive',
  RolloutRestartLive = 'RolloutRestartLive',
  CancelCanaryLive = 'CancelCanaryLive',
  EditResourceLive = 'EditResourceLive',
  BatchScaleLive = 'BatchScaleLive',
  BatchFullReleaseLive = 'BatchFullReleaseLive',
  BatchRolloutRestartLive = 'BatchRolloutRestartLive',
  ScaleNonLive = 'ScaleNonLive',
  RollbackNonLive = 'RollbackNonLive',
  FullReleaseNonLive = 'FullReleaseNonLive',
  RolloutRestartNonLive = 'RolloutRestartNonLive',
  CancelCanaryNonLive = 'CancelCanaryNonLive',
  EditResourceNonLive = 'EditResourceNonLive',
  BatchScaleNonLive = 'BatchScaleNonLive',
  BatchFullReleaseNonLive = 'BatchFullReleaseNonLive',
  BatchRolloutRestartNonLive = 'BatchRolloutRestartNonLive',
  KillLive = 'KillLive',
  BatchKillLive = 'BatchKillLive',
  KillNonLive = 'KillNonLive',
  BatchKillNonLive = 'BatchKillNonLive',
  Approve = 'Approve',
  ApproveLive = 'ApproveLive',
  ViewLive = 'ViewLive',
  ViewNonLive = 'ViewNonLive',
  DeleteLive = 'DeleteLive',
  DeleteNonLive = 'DeleteNonLive',
  // for pipeline
  CreateNonLive = 'CreateNonLive',
  EditNonLive = 'EditNonLive',
  RunNonLive = 'RunNonLive',
  RebuildNonLive = 'RebuildNonLive',
  AbortNonLive = 'AbortNonLive',
  CreateLive = 'CreateLive',
  EditLive = 'EditLive',
  RunLive = 'RunLive',
  RebuildLive = 'RebuildLive',
  AbortLive = 'AbortLive',
  Move = 'Move',
  Import = 'Import',
  Migrate = 'Migrate',
  BatchMigrate = 'BatchMigrate'
}

export const PLATFORM_ROLE_SCOPE = 0 // global user scope
export const PLATFORM_TENANT_ID = 0 // global tenant id
