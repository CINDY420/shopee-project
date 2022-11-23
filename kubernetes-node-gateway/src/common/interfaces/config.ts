export interface IServiceURLConfig {
  protocol: string
  host: string
  port?: string
}

export interface IUserGroupConfig {
  Id: number
  Name: string
  Approver: string
}

export interface IDeleteDeploymentConfig {
  allowDeleteClusters: string[]
  prohibitDeleteProjects: string[]
}

export interface IGlobalConfig {
  groups: string[]
  envs: string[]
  cids: string[]
  localSession: string
  UserGroupAdmin: string[]
  userGroupConfig: IUserGroupConfig[]
  podContainerNameRegex: string[]
  livePodExec: boolean
  oamApplications: string[]
  settings: string
  terminalAudit: boolean
  deleteDeploymentConfig: IDeleteDeploymentConfig
}

export interface ISpaceBot {
  username: string
  password: string
}

export interface IAnnouncements {
  tenant: number
  announcements: string[]
}
