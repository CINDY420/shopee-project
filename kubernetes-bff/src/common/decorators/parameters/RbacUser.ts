import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { RBAC_USER } from 'common/constants/sessions'

export const RbacUser = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request>()
  return request[RBAC_USER]
})
