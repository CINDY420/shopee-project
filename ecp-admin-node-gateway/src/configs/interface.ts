export interface IRapperApiConfig {
  baseUrl: string
  mockUrl?: string
}

export interface ISpaceUIC {
  baseUrl: string
}

interface IUser {
  email: string
  platform: string
}
interface IEcpAdmin {
  userList?: IUser[]
}
export interface IEcpGlobalConfig {
  ecpAdmin?: IEcpAdmin
}
