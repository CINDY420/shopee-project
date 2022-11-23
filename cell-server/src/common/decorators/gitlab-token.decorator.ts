import { IJwtBody } from '@/features/auth/strategies/jwt.strategy'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const GitlabToken = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request & { user: IJwtBody }>()
  const token = request.user.gitlabToken
  return token
})
