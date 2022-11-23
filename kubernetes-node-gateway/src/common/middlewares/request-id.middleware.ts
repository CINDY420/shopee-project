import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { randomUUID } from 'crypto'
import { RequestContext } from '@medibloc/nestjs-request-context'
import { CommonRequestContext } from '@/common/models/common-request-context'

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const requestId = request.header('x-request-id') || randomUUID()
    request.headers['x-request-id'] = requestId
    const ctx: CommonRequestContext = RequestContext.get()
    ctx.requestId = requestId
    response.set('x-request-id', requestId)

    next()
  }
}
