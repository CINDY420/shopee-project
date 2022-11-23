import { Request } from 'express'
import { AUTH_USER_INFO, AUTH_USER_PERMISSIONS } from '@/constants/auth'
import { PostApisUicV2AuthTokenValidateResDto } from '@/rapper/spaceUIC/dtos/post-apis-uic-v2-auth-token_validate.dto'

export interface IAuthUserPermissions {
  hasAccessPermission: boolean
}
export interface IExpressRequestWithContext extends Request {
  [AUTH_USER_INFO]?: PostApisUicV2AuthTokenValidateResDto
  [AUTH_USER_PERMISSIONS]?: IAuthUserPermissions
}
