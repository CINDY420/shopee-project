import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import {
  ThrottlerException,
  ThrottlerGuard,
  InjectThrottlerOptions,
  InjectThrottlerStorage,
  ThrottlerModuleOptions,
  ThrottlerStorage
} from '@nestjs/throttler'
import { AUTH_USER } from 'common/constants/sessions'
import { ConfigService } from '@nestjs/config'
import { ISkeBffConfig } from 'common/interfaces'
import { IAuthUser } from 'common/decorators/parameters/AuthUser'

@Injectable()
export class BotThrottlerGuard extends ThrottlerGuard {
  constructor(
    @InjectThrottlerOptions() protected readonly options: ThrottlerModuleOptions,
    @InjectThrottlerStorage() protected readonly storageService: ThrottlerStorage,
    protected readonly reflector: Reflector,
    private configService: ConfigService
  ) {
    super(options, storageService, reflector)
  }

  async handleRequest(context: ExecutionContext, initLimit: number, initTtl: number): Promise<boolean> {
    // Here we start to check the amount of requests being done against the ttl.
    const { req, res } = this.getRequestResponse(context)
    // Return early if the current user agent should be ignored.
    if (Array.isArray(this.options.ignoreUserAgents)) {
      for (const pattern of this.options.ignoreUserAgents) {
        if (pattern.test(req.headers['user-agent'])) {
          return true
        }
      }
    }

    const skeBffConfig = this.configService.get<ISkeBffConfig>('skeBffConfig')
    const { ttl: configTtl = initTtl, limit: configLimit = initLimit, specificBots = [] } =
      skeBffConfig?.rateLimit || {}

    const authUser: IAuthUser = req[AUTH_USER]
    // ignore user not logged in
    if (!authUser) return true

    const { ID: botId, Scope } = authUser
    // ignore not bot user
    const isBot = Scope !== 'user'
    if (!isBot) return true

    // check if specific bot
    const specificConfig = specificBots.find((botConfig) => botConfig.id === botId)
    const ttl = specificConfig?.ttl || configTtl
    const limit = specificConfig?.limit || configLimit

    const key = `${Scope}-${botId}`
    const ttls = await this.storageService.getRecord(key)
    const nearestExpiryTime = ttls.length > 0 ? Math.ceil((ttls[0] - Date.now()) / 1000) : 0
    // Throw an error when the user reached their limit.
    if (ttls.length >= limit) {
      res.header('Retry-After', nearestExpiryTime)
      throw new ThrottlerException(this.errorMessage)
    }
    res.header(`${this.headerPrefix}-Limit`, limit)
    // We're about to add a record so we need to take that into account here.
    // Otherwise the header says we have a request left when there are none.
    res.header(`${this.headerPrefix}-Remaining`, Math.max(0, limit - (ttls.length + 1)))
    res.header(`${this.headerPrefix}-Reset`, nearestExpiryTime)
    await this.storageService.addRecord(key, ttl)
    return true
  }
}
