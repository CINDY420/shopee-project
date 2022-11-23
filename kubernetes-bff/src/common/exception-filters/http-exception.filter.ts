import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  NotFoundException
} from '@nestjs/common'
import { Logger } from 'common/helpers/logger'

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
        typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as { message: string }).message
      return response.status(status).json({
        code: -1,
        message: `${exception.message}: ${exceptionReason}`,
        data: null,
        status
      })
    }

    if (exception instanceof NotFoundException) {
      return response.status(status).json({
        code: -1,
        message: `${exception.message}`,
        data: null,
        status
      })
    }

    const exceptionMessage = exception.message
    response.status(status).json({
      code: -1,
      // new user will get a '101' message
      message: exceptionMessage === '101' ? exceptionMessage : `inner http exception: ${exceptionMessage}`,
      data: null,
      status
    })
  }
}
