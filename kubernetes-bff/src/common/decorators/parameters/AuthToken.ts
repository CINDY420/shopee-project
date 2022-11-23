import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JWT_COOKIE_KEY } from 'common/constants/sessions'
import { Request } from 'express'

/**
 * get token from cookies for auth service
 */

export const AuthToken = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request>()
  const authToken = request.cookies[JWT_COOKIE_KEY]
  return authToken as string
})
