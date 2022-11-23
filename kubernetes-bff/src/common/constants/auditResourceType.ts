export enum AUDIT_RESOURCE_TYPE {
  OTHERS = 'Others',
  SESSION = 'Session',
  CLUSTER = 'Cluster',
  RESOURCE_QUOTA = 'ResourceQuota',
  NODE = 'Node',
  EVENT = 'Event',
  GROUP = 'Group',
  PROJECT = 'Project',
  APPLICATION = 'Application',
  TENANT = 'Tenant',
  SERVICE = 'Service',
  LOAD_BALANCE = 'LoadBalance',
  INGRESS = 'Ingress',
  DEPLOY = 'Deploy',
  POD = 'Pod',
  PIPELINE = 'Pipeline',
  BUILD = 'Build',
  TEMPLATE = 'Template',
  CONTAINER = 'Container',
  ACCESS = 'Access',
  ENV = 'Env',
  PROJ_WHITELIST = 'ProjWhitelist',
  USER = 'User',
  BOT = 'Bot',
  RELEASE_FREEZE = 'ReleaseFreeze',
  TEMPLATE_TYPE = 'TemplateType'
}

export const AUDIT_RESOURCE_TYPE_KEY = '__resource_type_key'

export enum OPERATION_SOURCE {
  BFF = 'Bff',
  OPEN_APIs = 'OpenAPIs'
}
