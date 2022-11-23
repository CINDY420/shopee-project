import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { IExpressRequestWithContext } from '@/common/interfaces/http'
import { AUTH_USER, JWT_COOKIE_KEY, RBAC_USER } from '@/common/constants/sessions'

@Injectable({ scope: Scope.REQUEST })
export class AuthInfoProvider {
  constructor(@Inject(REQUEST) private readonly requestWithContext: IExpressRequestWithContext) {}

  public getAuthUser() {
    return this.requestWithContext[AUTH_USER]
  }

  public getRbacUser() {
    return this.requestWithContext[RBAC_USER]
  }

  public getAuthToken(): string {
    return this.requestWithContext.cookies[JWT_COOKIE_KEY]
  }
}
