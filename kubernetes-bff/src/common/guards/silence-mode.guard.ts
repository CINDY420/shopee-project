import { CanActivate, ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'

/**
 * this guard is use for disaster recovery
 * when in silence mode, reject all request, keep app silence
 */
@Injectable()
export class SilentModeGuard implements CanActivate {
  constructor(private readonly configService: ConfigService, private readonly apiServerService: ApiServerService) {}

  async canActivate() {
    const isSilentMode = await this.apiServerService.checkIsSilenceMode()

    if (isSilentMode) {
      throw new ForbiddenException('request forbidden: currently service is in silence mode')
    }

    return true
  }
}
