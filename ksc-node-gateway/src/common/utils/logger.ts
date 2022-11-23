import { ConsoleLogger, Injectable, Scope } from '@nestjs/common'
import winston, { format } from 'winston'
import 'winston-daily-rotate-file'
import { RequestContext } from '@medibloc/nestjs-request-context'
import { CommonRequestContext } from '@/common/models/common-request-context'

const transport = new winston.transports.DailyRotateFile({
  filename:
    process.env.NODE_ENV === 'local' ? './logs/application-%DATE%.log' : '/workspace/log/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
})

const winstonLogger = winston.createLogger({
  level: 'verbose',
  format: format.combine(format.timestamp(), format.json()),
  transports: [transport],
})

const getRequestId = () => {
  const ctx: CommonRequestContext = RequestContext.get()
  return ctx?.requestId ?? 'system'
}

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger {
  log(message: string) {
    super.log.apply(this, [message])

    winstonLogger.log({
      level: 'info',
      label: this.context ?? 'system',
      requestId: getRequestId(),
      message,
    })
  }

  error(message: string) {
    super.error.apply(this, [message])

    winstonLogger.log({
      level: 'error',
      label: this.context ?? 'system',
      requestId: getRequestId(),
      message,
    })
  }

  warn(message: string) {
    super.warn.apply(this, [message])

    winstonLogger.log({
      level: 'warn',
      label: this.context ?? 'system',
      requestId: getRequestId(),
      message,
    })
  }

  debug(message: string) {
    super.debug.apply(this, [message])

    winstonLogger.log({
      level: 'debug',
      label: this.context ?? 'system',
      requestId: getRequestId(),
      message,
    })
  }

  verbose(message: string) {
    super.verbose.apply(this, [message])

    winstonLogger.log({
      level: 'verbose',
      label: this.context ?? 'system',
      requestId: getRequestId(),
      message,
    })
  }
}
