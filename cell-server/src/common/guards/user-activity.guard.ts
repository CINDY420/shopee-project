import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { UserService } from '@/features/user/user.service'
import { ConfigService } from '@nestjs/config'
import { IGetUserInfoByTokenResponse } from '@/shared/space-api/interfaces/space-api'
import { HttpService } from '@infra-node-kit/http'

@Injectable()
export class UserActivityGuard implements CanActivate {
  private readonly spaceBaseUrl = this.configService.get<string>('spaceBaseUrl')
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const authorization = request?.headers?.authorization
    if (!authorization) {
      return true
    }
    this.httpService
      .request<IGetUserInfoByTokenResponse>({
        baseURL: this.spaceBaseUrl,
        method: 'POST',
        url: '/apis/uic/v2/auth/token_validate',
        headers: {
          authorization,
        },
      })
      .then((response) => {
        const { data } = response
        const { user } = data
        this.userService.recordUserActivity(user?.email)
      })

    return true
  }
}
