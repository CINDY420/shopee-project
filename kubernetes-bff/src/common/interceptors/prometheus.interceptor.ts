import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AUDIT_RESOURCE_TYPE, AUDIT_RESOURCE_TYPE_KEY } from 'common/constants/auditResourceType'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { requestCounter, httpLatencyHistogram } from '../prometheusClient/promClient'
import { Logger } from 'common/helpers/logger'

@Injectable()
export class PrometheusInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PrometheusInterceptor.name)
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Update Prometheus metrics after Interceptor
    const request = context.switchToHttp().getRequest<Request>()
    const { url: path, method, query } = request
    const start = Date.now()
    const requestId = Date.now()

    this.logger.log(`receive client request: ${requestId} url ${path} method: ${method}`)

    const resourceType = this.reflector.get<AUDIT_RESOURCE_TYPE>(AUDIT_RESOURCE_TYPE_KEY, context.getHandler())

    return next.handle().pipe(
      tap(
        () => {
          const response = context.switchToHttp().getResponse()
          const { statusCode } = response
          // Count all success response, except for '../metrics'
          requestCounter.inc({ statusCode })

          const end = Date.now()

          this.logger.log(`finish client request: ${requestId}, latency ${end - start}ms`)
          if (resourceType) {
            httpLatencyHistogram.labels(method, statusCode, resourceType).observe(end - start)
          }
        },
        // If err, count the error response, except for '../metrics'
        (err) => {
          const { status } = err
          // If status is undefined, the err can't be a HttpError, and it must be a backend code error, so set the status 500.
          const statusCode = status || 500
          requestCounter.inc({ statusCode })
          const end = Date.now()
          this.logger.log(`finish client request: ${requestId}, latency ${end - start}ms`)

          if (resourceType) {
            httpLatencyHistogram.labels(method, statusCode, resourceType).observe(end - start)
          }
        }
      )
    )
  }
}
