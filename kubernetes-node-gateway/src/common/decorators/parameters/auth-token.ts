import { JWT_COOKIE_KEY } from '@/common/constants/sessions'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

/**
 * get token from cookies for auth service
 */

export const AuthToken = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request>()

  return request.cookies[JWT_COOKIE_KEY]
})
