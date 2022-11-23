import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AUTH_USER } from 'common/constants/sessions'
import { IJWTPayLoad, IRoleBinding } from 'common/interfaces/authService.interface'

export interface IAuthUser extends IJWTPayLoad {
  roles: IRoleBinding[]
}

export const AuthUser = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request>()
  return request[AUTH_USER] as IAuthUser
})
