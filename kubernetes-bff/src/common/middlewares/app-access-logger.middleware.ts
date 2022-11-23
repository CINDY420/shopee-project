import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { Logger } from 'common/helpers/logger'

@Injectable()
export class AppAccessLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {
    this.logger.setContext('access')
  }

  use(request: Request, response: Response, next: NextFunction) {
    const { ip, method, originalUrl: url } = request
    const userAgent = request.get('user-agent') || ''
    this.logger.log(`Request begin: ${JSON.stringify({ ip, method, url, userAgent }, null, 2)}`)

    response.on('finish', () => {
      const { statusCode } = response
      const contentLength = response.get('content-length') ?? '0'
      this.logger.log(`Request end: ${statusCode} ${contentLength} `)
    })

    next()
  }
}
