import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'

import { OPEN_API_TOKEN_KEY } from '@/common/constants/session'

@Injectable({ scope: Scope.REQUEST })
export class OpenApiInfoProvider {
  constructor(@Inject(REQUEST) private readonly requestWithContext: Request) {}

  public getOpenApiToken(): string {
    const cookies = this.requestWithContext.cookies || {}
    return cookies[OPEN_API_TOKEN_KEY]
  }
}
