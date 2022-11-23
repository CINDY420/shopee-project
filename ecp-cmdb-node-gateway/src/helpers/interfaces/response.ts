import { SamDefinedResponsePermissionProperty } from '@/helpers/constants/sam'

export interface ICMDBRES<T> {
  errno: number
  errmsg: string
  data: T
}

export type PCMDBRESRES<T> = Promise<ICMDBRES<T>>

export type ISamServiceAuthRelativeProps = {
  [SamDefinedResponsePermissionProperty.PERMISSION_TO_APPLY]?: object
  [SamDefinedResponsePermissionProperty.POLICY_ADMINS_TO_APPLY]?: object
  [SamDefinedResponsePermissionProperty.USER_GROUPS_TO_APPLY]?: object
  [SamDefinedResponsePermissionProperty.POLICY_ADMINS_TO_APPLY]?: object
  [SamDefinedResponsePermissionProperty.POLICY_GROUP_ADMINS_TO_APPLY]?: object
}

export interface ICMDBServiceResponse extends ISamServiceAuthRelativeProps {
  [key: string]: any
}

type IEcpServiceResponseMetadata = {
  [key in keyof ISamServiceAuthRelativeProps]?: string
}

export interface IEcpServiceResponse<T = any> {
  code: number
  message: string
  status: number
  data: T
  metadata: IEcpServiceResponseMetadata
}
