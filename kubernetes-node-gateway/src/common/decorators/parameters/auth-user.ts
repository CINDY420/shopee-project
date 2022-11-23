import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AUTH_USER } from '@/common/constants/sessions'
import { IJWTPayLoad, IRoleBinding } from '@/shared/auth/auth.interface'

export interface IAuthUser extends IJWTPayLoad {
  roles: IRoleBinding[]
  userName: string
}

export const AuthUser = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()
  return request[AUTH_USER]
})
