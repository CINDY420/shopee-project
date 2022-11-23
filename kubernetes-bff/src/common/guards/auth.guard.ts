import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { AUTH_USER, JWT_COOKIE_KEY } from 'common/constants/sessions'
import { Request } from 'express'
import { ForbiddenErrorCode } from 'common/constants/rbac'
import { AuthService } from 'common/modules/auth/auth.service'

interface IWhiteList {
  method: string
  path?: string
  regExp?: RegExp
}

@Injectable()
export class AuthGuard implements CanActivate {
  private sessionWhiteList: IWhiteList[] = []
  private newUserWhiteList: IWhiteList[] = []

  constructor(
    private authService: AuthService,
    { sessionWhiteList, newUserWhiteList }: { sessionWhiteList: IWhiteList[]; newUserWhiteList: IWhiteList[] }
  ) {
    this.sessionWhiteList = sessionWhiteList
    this.newUserWhiteList = newUserWhiteList
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest<Request>()
    const currentMethod = request.method
    const currentPath = request.path
    const matchedRequest = this.sessionWhiteList.find(({ method, path, regExp }) => {
      return method === currentMethod && (path === currentPath || (regExp && regExp.test(currentPath)))
    })
    if (matchedRequest) {
      return true
    }

    const cookies = request.cookies
    const token = cookies[JWT_COOKIE_KEY]
    const jwtSession = await this.authService.verifyToken(token)

    // check if new user
    const { ID } = jwtSession
    const userRoles = await this.authService.getUserRoles(ID, token)
    const { roles, totalSize } = userRoles

    // set user info for AuthUser decorator
    request[AUTH_USER] = { ...jwtSession, roles }

    if (!totalSize) {
      const matchedRequest = this.newUserWhiteList.find(({ method, path, regExp }) => {
        return method === currentMethod && (path === currentPath || (regExp && regExp.test(currentPath)))
      })

      if (matchedRequest) {
        return true
      } else {
        throw new ForbiddenException(ForbiddenErrorCode.NEED_APPLY_FOR_GROUP_AND_ROLE)
      }
    }

    return true
  }
}
