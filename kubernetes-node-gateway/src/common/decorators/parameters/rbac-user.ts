import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { RBAC_USER } from '@/common/constants/sessions'
import { IJWTPayLoad, IRoleBinding } from '@/shared/auth/auth.interface'

export interface IRbacUser extends IJWTPayLoad {
  roles: IRoleBinding[]
}

export const RbacUser = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()
  return request[RBAC_USER]
})
