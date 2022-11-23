export enum ForbiddenType {
  NewUser
}

export const messageTypeMap = {
  101: ForbiddenType.NewUser
}

export enum AUTH_STATUS {
  NOTFOUND = 'NOTFOUND',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED'
}

export const codeMap = {
  '-10313': ForbiddenType.NewUser
}
