import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { IExpressRequestWithContext } from '@/interfaces/auth'
import { AUTH_USER_INFO } from '@/constants/auth'
import { PostApisUicV2AuthTokenValidateResDto } from '@/rapper/spaceUIC/dtos/post-apis-uic-v2-auth-token_validate.dto'

@Injectable({ scope: Scope.REQUEST })
export class AuthInfoProvider {
  constructor(@Inject(REQUEST) private readonly requestWithContext: IExpressRequestWithContext) {}

  getAuthUserInfo(): PostApisUicV2AuthTokenValidateResDto | undefined {
    return this.requestWithContext[AUTH_USER_INFO]
  }
}
