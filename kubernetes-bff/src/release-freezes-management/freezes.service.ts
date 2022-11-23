import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { getLastReleaseFreezeResponseDto, ListFreezesQueryDto } from './dto/freezes.dto'
import { OpenApiService } from 'common/modules/openApi/openApi.service'
import { STATUS } from 'common/constants/releaseFreezes'
import { envToLiveOrNonLive } from 'common/helpers/env'
import { IRoleBinding } from 'common/interfaces/authService.interface'
import { PERMISSION_GROUP } from 'common/constants/rbac'
import { Logger } from 'common/helpers/logger'

type OpenAPiRequestFn = <T>(args: any) => Promise<T>

@Injectable()
export class FreezesService {
  request: OpenAPiRequestFn
  private readonly logger = new Logger(FreezesService.name)
  constructor(private readonly openApi: OpenApiService) {}

  async getLastReleaseFreeze(authToken: string, env: string): Promise<getLastReleaseFreezeResponseDto> {
    try {
      const query: ListFreezesQueryDto = { status: STATUS.FREEZING }
      const releaseFreezes = await this.openApi.listReleaseFreezes(query, authToken)
      const freezingList = releaseFreezes.releaseFreezeList
      const envFreezingList = env ? freezingList.filter((item) => item.env.split('/').includes(env)) : freezingList
      const lastFreeze = envFreezingList.length
        ? envFreezingList.reduce((prev, curr) => {
            return prev.endTime > curr.endTime ? prev : curr
          })
        : undefined
      return lastFreeze ? { isFreezing: true, item: lastFreeze } : { isFreezing: false }
    } catch (err) {
      throw new HttpException(`failed to list release freezes: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async canOperateDuringFreezing(roles: IRoleBinding[]): Promise<boolean> {
    let hasPermission = false
    roles.forEach((role) => {
      if (role.roleId === PERMISSION_GROUP.TENANT_ADMIN || role.roleId === PERMISSION_GROUP.LIVE_OPERATOR) {
        hasPermission = true
      }
    })
    return hasPermission
  }

  async isEnvFreezing(env: string, authToken: string): Promise<boolean> {
    const binaryEnv = envToLiveOrNonLive(env)
    const lastFreeze = await this.getLastReleaseFreeze(authToken, binaryEnv)
    return lastFreeze.isFreezing
  }
}
