import { ERROR } from '@/common/constants/error'
import { throwError } from '@/common/utils/throw-error'
import { AuthService } from '@/shared/auth/auth.service'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AUTH_USER, JWT_COOKIE_KEY } from '../constants/sessions'
import { IExpressRequestWithContext } from '../interfaces/http'

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
    { sessionWhiteList, newUserWhiteList }: { sessionWhiteList: IWhiteList[]; newUserWhiteList: IWhiteList[] },
  ) {
    this.sessionWhiteList = sessionWhiteList
    this.newUserWhiteList = newUserWhiteList
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IExpressRequestWithContext>()
    const currentMethod = request.method
    const currentPath = request.path
    const isMatchedRequest = this.sessionWhiteList.some(
      ({ method, path, regExp }) => method === currentMethod && (path === currentPath || regExp?.test?.(currentPath)),
    )

    if (isMatchedRequest) {
      return true
    }

    const cookies = request.cookies
    const token = cookies[JWT_COOKIE_KEY]
    const jwtSession = await this.authService.verifyToken(token)

    // check if new user
    const { ID } = jwtSession
    const userRoles = await this.authService.getUserRoles(ID, token)
    const { roles, totalSize } = userRoles
    const userName = await this.authService.getUserName(token, jwtSession.ID)

    // set user info for AuthUser decorator
    request[AUTH_USER] = { ...jwtSession, roles, userName }

    if (!totalSize) {
      const isMatchedRequest = this.newUserWhiteList.some(
        ({ method, path, regExp }) => method === currentMethod && (path === currentPath || regExp?.test?.(currentPath)),
      )

      if (isMatchedRequest) {
        return true
      } else {
        throwError(ERROR.SYSTEM_ERROR.AUTH.RESOURCE_FORBIDDEN_ERROR)
      }
    }

    return true
  }
}
