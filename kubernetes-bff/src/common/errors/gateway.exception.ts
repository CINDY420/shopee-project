import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common'
import { MESSAGES } from '@nestjs/core/constants'
import { WsException } from '@nestjs/websockets'
import { Logger } from 'common/helpers/logger'

@Catch(Error, WsException)
export class GatewayExceptionFilter implements WsExceptionFilter {
  private static readonly logger = new Logger('GatewayExceptionsHandler')
  catch(exception: WsException, host: ArgumentsHost) {
    if (!(exception instanceof WsException)) {
      return GatewayExceptionFilter.logger.error((exception as Error)?.message || MESSAGES.UNKNOWN_EXCEPTION_MESSAGE)
    }
    return GatewayExceptionFilter.logger.error(exception.stack)
  }
}
