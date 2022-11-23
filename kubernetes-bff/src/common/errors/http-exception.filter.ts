import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  UnauthorizedException,
  HttpStatus,
  Logger
} from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { Response } from 'express'
import { RedirectException } from './redirect.exception'

// only handle HttpException
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest()
    let status = exception.getStatus()

    this.logger.error('http exception handle error: ' + exception.message, exception.stack)

    let payload: any
    switch (exception.constructor) {
      case BadRequestException:
        const result = this.getBadRequestExceptionPayload(exception)
        status = result.status
        payload = result.payload
        break
      case UnauthorizedException:
        payload = {
          message: exception.message
        }
        break
      case RedirectException:
        const redirectException = exception as RedirectException
        const host = request.get('host')
        const url = redirectException.url
        // response.status(redirectException.getStatus()).redirect(redirectException.url)
        payload = {
          detail: [`https://${host}${url}`]
        }
        break

      default:
        payload = {
          message: exception.message
        }
    }

    response.status(status).json(payload)
  }

  getBadRequestExceptionPayload(exception: BadRequestException) {
    const response: any = exception.getResponse()
    const errors: any = response.message

    const status = exception.getStatus()

    if (Array.isArray(errors) && errors.length > 0 && errors[0] instanceof ValidationError) {
      let notExistError = null
      const fieldErrors = errors.map(({ constraints }) => {
        notExistError = constraints.find((constraint) => constraint.match('not exist'))
        return `${Object.values(constraints).join(' and ')}`
      })

      if (notExistError) {
        return {
          payload: {
            message: notExistError
          },
          status: HttpStatus.NOT_FOUND
        }
      }

      return {
        payload: {
          message: fieldErrors.join(';')
        },
        status
      }
    }

    if (Array.isArray(errors) && errors.length > 0 && errors.every((value) => typeof value === 'string')) {
      const notExistError = errors.find((error) => error.match('not exist'))

      if (notExistError) {
        return {
          payload: {
            message: notExistError
          },
          status: HttpStatus.NOT_FOUND
        }
      }

      return {
        payload: {
          message: errors.join(';')
        },
        status
      }
    }

    return {
      payload: {
        message: errors
      },
      status
    }
  }
}
