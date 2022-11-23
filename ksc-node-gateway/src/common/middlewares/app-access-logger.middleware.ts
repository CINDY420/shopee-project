import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { Logger } from '@/common/utils/logger'

@Injectable()
export class AppAccessLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {
    this.logger.setContext('access')
  }

  use(request: Request, response: Response, next: NextFunction) {
    const { ip, method, path: url } = request
    const userAgent = request.get('user-agent') || ''
    this.logger.log(`Request begin: ${method} ${url} - ${userAgent} ${ip}`)

    response.on('finish', () => {
      const { statusCode } = response
      const contentLength = response.get('content-length') ?? '0'
      this.logger.log(`Request end: ${statusCode} ${contentLength} `)
    })

    next()
  }
}
