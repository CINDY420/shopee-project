import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { Logger } from '@/common/utils/logger'

const logger = new Logger()

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor() {
    logger.setContext(HttpExceptionFilter.name)
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()
    logger.error(`catch: ${JSON.stringify(exception)}`)

    if (exception instanceof BadRequestException) {
      const exceptionReason =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message: string }).message
      return response.status(status).json({
        code: -1,
        message: `${exception.message}: ${exceptionReason}`,
        data: null,
        status,
      })
    }

    if (exception instanceof NotFoundException) {
      return response.status(status).json({
        code: -1,
        message: `${exception.message}`,
        data: null,
        status,
      })
    }

    response.status(status).json({
      code: -1,
      message: `inner http exception: ${exception.message}`,
      data: null,
      status,
    })
  }
}
