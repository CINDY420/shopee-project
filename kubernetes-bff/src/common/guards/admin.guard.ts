import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from 'common/modules/auth/auth.service'
import { JWT_COOKIE_KEY } from 'common/constants/sessions'

const ADMIN_ID = 2000
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest<Request>()

    const cookies = request.cookies
    const token = cookies[JWT_COOKIE_KEY]
    const jwtSession = await this.authService.verifyToken(token)

    const { ID } = jwtSession
    const userRoles = await this.authService.getUserRoles(ID, token)
    const { roles } = userRoles
    const isAdmin = roles.some(({ roleId }) => roleId === ADMIN_ID)
    return isAdmin
  }
}
