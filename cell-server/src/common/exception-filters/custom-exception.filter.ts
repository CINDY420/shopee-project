import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { Logger } from '@/common/utils/logger'
import { CustomException } from '@/common/models/custom-exception'

const logger = new Logger()

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  constructor() {
    logger.setContext(CustomExceptionFilter.name)
  }

  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    logger.error(`catch: ${JSON.stringify({ ...exception, message: exception.message })}`)

    response.status(exception.status).json({
      code: exception.code ?? -1,
      message: `inner custom exception: ${exception.message}`,
      data: null,
      status: exception.status,
    })
  }
}
