export enum AccessRequestPermissionType {
  TENANT_USER = 'Tenant User',
  PLATFORM_USER = 'Platform User'
}

export enum UserType {
  USER = 'User',
  BOT = 'Bot'
}

export enum AddUserType {
  HUMAN = 'Human',
  BOT = 'Bot'
}

export enum PLATFORM_USER_ROLE {
  PLATFORM_ADMIN = 2000,
  PLATFORM_DEVELOPER = 2005,
  PLATFORM_VIEWER = 2006
}

export enum PERMISSION_GROUP {
  PLATFORM_ADMIN = 'Platform Admin',
  TENANT_ADMIN = 'Tenant Admin',
  LIVE_OPERATOR = 'Live Operator',
  TERMINAL_APPROVER = 'Terminal Approver',
  DEVELOPER = 'Developer'
}

export enum RBACActionType {
  INITIAL_ACCESS = 'INITIAL_ACCESS',
  CHANGE_ROLE = 'CHANGE_ROLE',
  ADD_ROLE = 'ADD_ROLE',
  TERMINAL = 'TERMINAL' // huadong TODO change terminal apply
}

export enum TICKET_TYPE {
  TERMINAL = 'TERMINAL',
  CHANGE_ROLE = 'CHANGE_ROLE',
  ADD_ROLE = 'ADD_ROLE'
}
