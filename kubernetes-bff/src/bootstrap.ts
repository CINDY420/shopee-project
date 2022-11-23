import { Reflector } from '@nestjs/core'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { AppModule } from 'app.module'
import { useContainer } from 'class-validator'
import { ESService } from 'common/modules/es/es.service'
import { RbacService } from 'rbac/rbac.service'

import * as cookieParser from 'cookie-parser'
import { AuditInterceptor } from 'common/interceptors/audit.interceptor'
import { PrometheusInterceptor } from 'common/interceptors/prometheus.interceptor'
import { AuthGuard } from 'common/guards/auth.guard'
import { GlobalRbacGuard } from 'common/guards/global.rbac.guard'
import { TenantRbacGuard } from 'common/guards/tenant.rbac.guard'
import { ESIndex } from 'common/constants/es'
import {
  AUTH_V2_MAPPINGS,
  BOT_MAPPINGS,
  TICKET_MAPPINGS,
  POLICY_MAPPINGS,
  RELEASE_FREEZE_MAPPINGS,
  PROF_DESCRIPTOR_MAPPING,
  TERMINAL_REPLAY_MAPPING
} from 'common/constants/esMapping'
import { DocumentBuilder, SwaggerModule, SwaggerDocumentOptions } from '@nestjs/swagger'
import { ExpressWsAdapter } from 'common/adapters/express-ws-adapter'
import { AuthService } from 'common/modules/auth/auth.service'
import { HttpExceptionFilter } from 'common/exception-filters/http-exception.filter'
import { CustomExceptionFilter } from 'common/exception-filters/custom-exception.filter'
import { requestContextMiddleware } from '@medibloc/nestjs-request-context'
import { CommonRequestContext } from 'common/models/common-request-context'
import { TimeoutInterceptor } from 'common/interceptors/timeout.interceptor'
import { ThrottlerStorage } from '@nestjs/throttler'
import { BotThrottlerGuard } from 'common/guards/bot.throttle.guard'
import { ConfigService } from '@nestjs/config'
import { SilentModeGuard } from 'common/guards/silence-mode.guard'
import { ApiServerService } from 'common/modules/apiServer/apiServer.service'

export async function applicationBootstrap(app: INestApplication, isTest = false) {
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE', 'UPDATE', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Content-Length',
      'Accept-Encoding',
      'X-CSRF-Token',
      'Authorization',
      'X-Max',
      'Content-Disposition'
    ],
    exposedHeaders: [
      'Content-Type',
      'Content-Length',
      'Accept-Encoding',
      'X-CSRF-Token',
      'Authorization',
      'X-Max',
      'Content-Disposition'
    ],
    credentials: true
  })

  app.enableShutdownHooks()

  const rbacService = app.get(RbacService)
  const reflector = app.get(Reflector)
  const esService = app.get(ESService)
  const authService = app.get(AuthService)
  const storageService = app.get(ThrottlerStorage)
  const configService = app.get(ConfigService)
  const apiServerService = app.get(ApiServerService)

  app.use(cookieParser())
  app.use(requestContextMiddleware(CommonRequestContext))
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new HttpExceptionFilter(), new CustomExceptionFilter())
  app.useGlobalInterceptors(
    new AuditInterceptor(esService, authService, reflector),
    new PrometheusInterceptor(reflector)
  )
  app.useGlobalInterceptors(new TimeoutInterceptor())
  app.useWebSocketAdapter(new ExpressWsAdapter(app))

  app.useGlobalGuards(
    new SilentModeGuard(configService, apiServerService),
    new AuthGuard(authService, {
      sessionWhiteList: [
        { method: 'POST', path: isTest ? '/sessions' : '/api/v3/sessions' },
        { method: 'DELETE', path: isTest ? '/sessions' : '/api/v3/sessions' }
      ],
      newUserWhiteList: [
        { method: 'GET', path: '/api/v3/resource/GLOBAL/accessControl' },
        { method: 'GET', path: '/api/v3/resource/TENANT/accessControl' },
        { method: 'POST', path: '/api/v3/newUserApply/tenantUser' },
        { method: 'POST', path: '/api/v3/newUserApply/platformUser' },
        { method: 'GET', path: '/api/v3/tenants' },
        { method: 'GET', path: '/api/v3/tenantsRoles' },
        { method: 'GET', path: '/api/v3/globalRoles' },
        { method: 'GET', regExp: /^\/api\/v3\/getUserRoleBinding/ },
        { method: 'GET', regExp: /^\/api\/v3\/latestNewUserTicketStatus/ },
        { method: 'GET', path: '/api/v3/ticket/myApproverPendingTickets' },
        { method: 'GET', path: '/api/v3/ticket/myApproverHistoryTickets' },
        { method: 'GET', path: '/api/v3/ticket/myTickets' },
        { method: 'GET', regExp: /^\/api\/v3\/ticket\/(.+)\/detail/ },
        { method: 'DELETE', regExp: /^\/api\/v3\/ticket\/(.+)/ },
        { method: 'GET', path: '/api/v3/isRoleRequestPending' }
      ]
    }),
    new GlobalRbacGuard(reflector, rbacService),
    new TenantRbacGuard(reflector, authService),
    new BotThrottlerGuard(
      {
        ttl: 5,
        limit: 5 * 10
      },
      storageService,
      reflector,
      configService
    )
  )

  await esService.waitForReady()
  await esService.initIndex(ESIndex.AUTH_V2, AUTH_V2_MAPPINGS)
  await esService.initIndex(ESIndex.BOT, BOT_MAPPINGS)
  await esService.initIndex(ESIndex.TICKET, TICKET_MAPPINGS)
  await esService.initIndex(ESIndex.AUTH_POLICY, POLICY_MAPPINGS)
  await esService.initIndex(ESIndex.RELEASE_FREEZE_POLICY, RELEASE_FREEZE_MAPPINGS)
  await esService.initIndex(ESIndex.PROF_DESCRIPTOR, PROF_DESCRIPTOR_MAPPING)
  await esService.initIndex(ESIndex.TERMINAL_REPLAY, TERMINAL_REPLAY_MAPPING)

  if (!isTest) {
    app.setGlobalPrefix('api/v3')

    const options = new DocumentBuilder()
      .setTitle('Kubernetes bff document')
      .setDescription('The k8s API description')
      .setVersion('1.0')
      .build()

    const config: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        `${controllerKey}${methodKey.replace(/^\S/, (s) => s.toUpperCase())}`
    }

    const document = SwaggerModule.createDocument(app, options, config)
    SwaggerModule.setup('api/v3/api', app, document)
  }
}
