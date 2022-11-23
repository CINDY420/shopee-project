import { NestFactory, Reflector } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import { requestContextMiddleware } from '@medibloc/nestjs-request-context'

import { AppModule } from '@/app.module'
import { Logger } from '@/common/utils/logger'
import { CommonRequestContext } from '@/common/models/common-request-context'
import { WrapResponseInterceptor } from '@/common/interceptors/wrap-response.interceptor'
import { AuditInterceptor } from '@/common/interceptors/audit.interceptor'
import { HttpExceptionFilter } from '@/common/exception-filters/http-exception.filter'
import { UnknownExceptionFilter } from '@/common/exception-filters/unknown-exception.filter'
import { CustomExceptionFilter } from '@/common/exception-filters/custom-exception.filter'
import { prometheusRunningPort } from '@/common/constants/prometheus'
import { AuthGuard } from '@/common/guards/auth.guard'
import { GlobalRbacGuard } from '@/common/guards/global-rbac.guard'
import { TenantRbacGuard } from '@/common/guards/tenant-rbac.guard'
import { AuthService } from '@/shared/auth/auth.service'
import { RbacService } from '@/features/rbac/rbac.service'
import { SilentModeGuard } from '@/common/guards/silent-mode.guard'
import { ApiServerService } from '@/shared/apiServer/apiServer.service'
import { bootstrapZenoMonitor, httpRequestMiddlewareGenerator } from '@zeno/agent-monitor-nest'
import * as profiler from '@zeno/agent-profiler'

const logger = new Logger()
logger.setContext('system')

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger,
  })
  app.use(httpRequestMiddlewareGenerator())

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
      'Content-Disposition',
    ],
    exposedHeaders: [
      'Content-Type',
      'Content-Length',
      'Accept-Encoding',
      'X-CSRF-Token',
      'Authorization',
      'X-Max',
      'Content-Disposition',
    ],
    credentials: true,
  })
  app.use(cookieParser())

  app.enableShutdownHooks()

  const rbacService = app.get(RbacService)
  const reflector = app.get(Reflector)
  const authService = app.get(AuthService)
  const esService = app.get(ElasticsearchService)
  const configService = app.get(ConfigService)
  const apiServerService = app.get(ApiServerService)

  app.setGlobalPrefix('api/v1')
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      forbidUnknownValues: false,
      stopAtFirstError: true,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  app.use(requestContextMiddleware(CommonRequestContext))
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new AuditInterceptor(logger, authService, reflector, esService),
  )
  app.useGlobalFilters(new UnknownExceptionFilter(), new HttpExceptionFilter(), new CustomExceptionFilter())
  app.useGlobalGuards(
    new SilentModeGuard(apiServerService, [{ method: 'GET', path: '/api/v1/global/announcements' }]),
    new AuthGuard(authService, {
      /**
       * 不需要鉴权的接口
       */
      sessionWhiteList: [
        { method: 'GET', path: '/api/v1/global/announcements' },
        { method: 'GET', path: '/api/v1/ping' },
        { method: 'POST', path: '/api/v1/sessions' },
        { method: 'DELETE', path: '/api/v1/sessions' },
      ],
      /**
       * 游客用户不需要鉴权的业务接口
       */
      newUserWhiteList: [
        { method: 'GET', regExp: /^\/api\/v1\/tickets([/?](.+))?/ },
        { method: 'DELETE', regExp: /^\/api\/v1\/tickets([/?](.+))?/ },
        { method: 'GET', path: '/api/v1/rbac/resource/GLOBAL/accessControl' },
        { method: 'GET', path: '/api/v1/rbac/resource/TENANT/accessControl' },
      ],
    }),
    new GlobalRbacGuard(reflector, rbacService, logger),
    new TenantRbacGuard(reflector, authService, logger),
  )

  const options = new DocumentBuilder()
    .setTitle('Kubernetes bff document')
    .setDescription('Kubernetes Platform API description')
    .setVersion('1.0')
    .build()

  const config: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey}${methodKey.replace(/^\S/, (s) => s.toUpperCase())}`,
  }

  const swaggerDocument = SwaggerModule.createDocument(app, options, config)
  SwaggerModule.setup('api/v1/api', app, swaggerDocument)

  const port = configService.get<number>('http.port') ?? 3000

  logger.setContext('system')
  await app.listen(port)
  logger.log(`Application is running on: ${await app.getUrl()}`)
}

;(async () => {
  await bootstrap()
  bootstrapZenoMonitor({ port: prometheusRunningPort })
  profiler.start({
    logLevel: profiler.LogLevel.INFO,
    appId: '685059fa-2213-4811-9ee8-4b35bb6b8a04',
    appSecret: 'eed9ece2136f6dd64d37a9c80c65a4e0cc128c6e95929d7d98a79356c2977472',
  })
  logger.log(`Application start is complete`)
})()

process.on('unhandledRejection', (err: Error) => {
  logger.error(`unhandledRejection: \n${err.stack}`)
})

process.on('uncaughtException', (err: Error) => {
  logger.error(`uncaughtException: \n${err.stack}`)
})
