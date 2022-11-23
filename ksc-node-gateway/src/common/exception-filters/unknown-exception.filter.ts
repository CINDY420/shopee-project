import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common'
import { Logger } from '@/common/utils/logger'

const logger = new Logger()

@Catch()
export class UnknownExceptionFilter implements ExceptionFilter {
  constructor() {
    logger.setContext(UnknownExceptionFilter.name)
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    logger.error(`catch: ${JSON.stringify(exception)}`)
    if (exception instanceof Error) {
      logger.error(exception?.stack ?? exception.message ?? exception.toString() ?? 'unknown error')
    }
    const message = exception instanceof Error ? exception.message : JSON.stringify(exception)

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: -1,
      message: `inner unknown exception: ${message}`,
      data: null,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
