import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AUDIT_RESOURCE_TYPE, AUDIT_RESOURCE_TYPE_KEY, OPERATION_SOURCE } from 'common/constants/auditResourceType'
import { ESIndex } from 'common/constants/es'
import { USER_LOG_MAPPING } from 'common/constants/esMapping'
import { AUTH_USER, JWT_COOKIE_KEY } from 'common/constants/sessions'
import { ESService } from 'common/modules/es/es.service'
import { AuthService } from 'common/modules/auth/auth.service'
import { Request, Response } from 'express'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { IAuthUser } from 'common/decorators/parameters/AuthUser'
import { parseTenantIdFromPath } from 'common/helpers/group'
import { TOKEN_SCOPE } from 'common/interfaces/authService.interface'
import { Logger } from 'common/helpers/logger'

const formatNumber = (n) => (n < 10 ? '0' + n : n)

export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name)

  constructor(private esService: ESService, private authService: AuthService, private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // const start = Date.now()
    return next.handle().pipe(
      tap(() => {
        this.logger.log(`Audit ${context.switchToHttp().getRequest().url}`)
        const request = context.switchToHttp().getRequest<Request>()
        const response = context.switchToHttp().getResponse<Response>()

        const authUser = request[AUTH_USER] as IAuthUser
        if (!authUser) {
          this.logger.error('Cannot retrieve auth user information')
          return
        }

        const resourceType = this.reflector.get<AUDIT_RESOURCE_TYPE>(AUDIT_RESOURCE_TYPE_KEY, context.getHandler())
        this.recordAuditLog(request, resourceType, response, authUser)
      })
    )
  }

  private async recordAuditLog(
    request: Request,
    resourceType: AUDIT_RESOURCE_TYPE,
    response: Response,
    authUser: IAuthUser
  ) {
    if (!resourceType) {
      return
    }
    const now = new Date(Date.now())
    const esIndex = `${ESIndex.USER_LOG}-${now.getFullYear()}-${formatNumber(now.getMonth() + 1)}-${formatNumber(
      now.getDate()
    )}`
    // parse tenant info
    const tenantId = parseTenantIdFromPath(request.path)
    let tenantName = 'Global'
    if (tenantId) {
      try {
        const authToken = request.cookies[JWT_COOKIE_KEY]
        const tenantInfo = await this.authService.getTenantById(Number(tenantId), authToken)
        tenantName = tenantInfo.name
      } catch (err) {
        this.logger.error(`Failed to get tenant info from auth:${err}`)
      }
    }

    await this.esService.initIndex(esIndex as ESIndex, USER_LOG_MAPPING)
    const originalUrl = request.originalUrl
    const questionMarkIndex = originalUrl.indexOf('?')
    const queryString = questionMarkIndex > 0 ? originalUrl.slice(questionMarkIndex + 1) : ''

    const { Email, roles, ID, Scope } = authUser
    const userTenantNames = roles.map(({ tenantName }) => tenantName)
    const tenantIds = roles.map(({ tenantId }) => tenantId)

    // record bot name for token only contains botId
    let userName = Email
    if (Scope === TOKEN_SCOPE.BOT) {
      try {
        const authToken = request.cookies[JWT_COOKIE_KEY]
        const bot = await this.authService.getBotById(Number(ID), authToken)
        userName = bot.name
      } catch (err) {
        this.logger.error(`Failed to get bot info from auth:${err}`)
      }
    }

    const userLog = {
      email: Email,
      name: userName,
      department: tenantIds.join('/'),
      group: userTenantNames.join('/'),
      tenant: tenantName,
      source: OPERATION_SOURCE.BFF,
      requestPath: request.path,
      object: resourceType,
      requestMethod: request.method,
      requestQuery: queryString,
      requestHeader: '',
      requestBody: resourceType === AUDIT_RESOURCE_TYPE.SESSION ? '' : JSON.stringify(request.body),
      responseCode: '' + response.statusCode,
      '@timestamp': now.toISOString()
    }
    try {
      return await this.esService.index(esIndex as ESIndex, userLog)
    } catch (err) {
      this.logger.error(`Failed to audit for ${err?.stack}`)
    }
  }
}
