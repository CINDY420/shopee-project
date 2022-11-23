import { IJwtBody } from '@/features/auth/strategies/jwt.strategy'
import { ERROR } from '@/common/constants/error'
import { JWT_STRATEGY_NAME } from '@/common/constants/jwt'
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator'
import { throwError } from '@/common/utils/throw-error'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_STRATEGY_NAME) {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }
    return super.canActivate(context)
  }

  handleRequest<T = IJwtBody>(err: Error, user: T) {
    if (err || !user) {
      throwError(ERROR.SYSTEM_ERROR.AUTH.GITLAB_UNAUTHORIZED_ERROR)
    }
    return user
  }
}
