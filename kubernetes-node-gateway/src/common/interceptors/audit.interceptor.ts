import { CallHandler, ExecutionContext, HttpStatus, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AUDIT_RESOURCE_TYPE, AUDIT_RESOURCE_TYPE_KEY, OPERATION_SOURCE } from '@/common/constants/audit-resource-type'
import { ES_INDEX } from '@/common/constants/es'
import { USER_LOG_MAPPING } from '@/common/constants/es-mapping'
import { AUTH_USER, JWT_COOKIE_KEY } from '@/common/constants/sessions'
import { Logger } from '@/common/utils/logger'

import { AuthService } from '@/shared/auth/auth.service'
import { Response } from 'express'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { IAuthUser } from '@/common/decorators/parameters/auth-user'
import { TOKEN_SCOPE } from '@/shared/auth/auth.interface'
import * as moment from 'moment'
import { tryCatch } from '@/common/utils/try-catch'
import { IExpressRequestWithContext } from '@/common/interfaces/http'
import { throwError } from '@/common/utils/throw-error'
import { ERROR } from '@/common/constants/error'
import { ElasticsearchService } from '@nestjs/elasticsearch'

export class AuditInterceptor<TOriginalResponseBody> implements NestInterceptor {
  constructor(
    private readonly logger: Logger,
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
    private readonly elasticsearchService: ElasticsearchService,
  ) {
    logger.setContext(AuditInterceptor.name)
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<TOriginalResponseBody>,
  ): Observable<TOriginalResponseBody> | Promise<Observable<TOriginalResponseBody>> {
    return next.handle().pipe(
      tap(() => {
        this.logger.log(`Audit ${context.switchToHttp().getRequest().url}`)
        const request = context.switchToHttp().getRequest<IExpressRequestWithContext>()
        const authUser = request[AUTH_USER]
        const response = context.switchToHttp().getResponse<Response>()
        if (!authUser) {
          this.logger.error('Cannot retrieve auth user information')
          return
        }
        const resourceType = this.reflector.get<AUDIT_RESOURCE_TYPE | undefined>(
          AUDIT_RESOURCE_TYPE_KEY,
          context.getHandler(),
        )
        if (resourceType) {
          this.recordAuditLog(request, resourceType, response, authUser)
        }
      }),
    )
  }

  private async recordAuditLog(
    request: IExpressRequestWithContext,
    resourceType: AUDIT_RESOURCE_TYPE,
    response: Response,
    authUser: IAuthUser,
  ) {
    const { message, code, status } = ERROR.SYSTEM_ERROR.ES_SERVICE.REQUEST_ERROR
    const esIndex = `${ES_INDEX.USER_LOG}-${moment.utc(new Date()).format('YYYY-MM-DD')}`
    const tenantId = request.params?.tenantId
    const authToken: string = request.cookies[JWT_COOKIE_KEY]

    const tenantName = tenantId ? await this.getTenantOrBotName(Number(tenantId), authToken, 'tenants') : 'Global'

    const isIndexExisted = await this.elasticsearchService.indices.exists({ index: esIndex })
    if (isIndexExisted.statusCode === HttpStatus.NOT_FOUND) {
      const [, initError] = await tryCatch(
        Promise.resolve(this.elasticsearchService.indices.create({ index: esIndex, body: USER_LOG_MAPPING })),
      )
      throwError(`${message}: fail to create a new es index. ${initError?.stack}`, code, status)
    }
    const originalUrl = request.originalUrl
    const questionMarkIndex = originalUrl.indexOf('?')
    const queryString = questionMarkIndex > 0 ? originalUrl.slice(questionMarkIndex + 1) : ''

    const { Email, roles, ID, Scope } = authUser
    const userTenantNames = roles.map(({ tenantName }) => tenantName)
    const tenantIds = roles.map(({ tenantId }) => tenantId)
    // record bot name for token only contains botId
    const name = Scope === TOKEN_SCOPE.BOT ? await this.getTenantOrBotName(ID, authToken, 'bots') : Email

    const userLog = {
      email: Email,
      name,
      department: tenantIds.join('/'),
      group: userTenantNames.join('/'),
      tenant: tenantName,
      source: OPERATION_SOURCE.BFF,
      requestPath: request.path,
      type: resourceType,
      requestMethod: request.method,
      requestQuery: queryString,
      requestHeader: '',
      requestBody: resourceType === AUDIT_RESOURCE_TYPE.SESSION ? '' : JSON.stringify(request.body),
      responseCode: `${response.statusCode}`,
      '@timestamp': new Date().toISOString(),
    }
    const [, appendError] = await tryCatch(
      Promise.resolve(this.elasticsearchService.index({ index: esIndex, body: userLog })),
    )
    throwError(`${message}: fail to append data to existing index. ${appendError?.stack}`, code, status)
  }

  private async getTenantOrBotName(tenantId: number, authToken: string, type: string) {
    const [data, error] = await tryCatch(
      Promise.resolve(this.authService.getTenantOrBotById(tenantId, authToken, type)),
    )
    if (error || !data) {
      throwError(ERROR.SYSTEM_ERROR.AUTH.REQUEST_ERROR, ` Failed to get ${type} info from auth: ${error}`)
    }
    return data.name
  }
}
