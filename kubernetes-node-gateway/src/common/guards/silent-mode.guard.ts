import { ERROR } from '@/common/constants/error'
import { IExpressRequestWithContext } from '@/common/interfaces/http'
import { throwError } from '@/common/utils/throw-error'
import { ApiServerService } from '@/shared/apiServer/apiServer.service'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

interface IWhiteList {
  method: string
  path?: string
  regExp?: RegExp
}

/**
 * this guard is use for disaster recovery
 * when in silence mode, reject all request, keep app silence
 */
@Injectable()
export class SilentModeGuard implements CanActivate {
  private whiteList: IWhiteList[] = []
  constructor(private readonly apiServerService: ApiServerService, whiteList: IWhiteList[]) {
    this.whiteList = whiteList
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<IExpressRequestWithContext>()
    const currentMethod = request.method
    const currentPath = request.path
    const isMatchedRequest = this.whiteList.some(
      ({ method, path, regExp }) => method === currentMethod && (path === currentPath || regExp?.test?.(currentPath)),
    )

    if (isMatchedRequest) {
      return true
    }

    const isSilentMode = await this.apiServerService.checkIsSilenceMode()

    if (isSilentMode) {
      throwError(ERROR.SYSTEM_ERROR.AUTH.FORBIDDEN_ERROR, 'currently service is in silence mode')
    }

    return true
  }
}
