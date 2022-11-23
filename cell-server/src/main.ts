import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger'
import { requestContextMiddleware } from '@medibloc/nestjs-request-context'
import cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'

import { AppModule } from '@/app.module'
import { Logger } from '@/common/utils/logger'
import { CommonRequestContext } from '@/common/models/common-request-context'
import { WrapResponseInterceptor } from '@/common/interceptors/wrap-response.interceptor'
import { HttpExceptionFilter } from '@/common/exception-filters/http-exception.filter'
import { UnknownExceptionFilter } from '@/common/exception-filters/unknown-exception.filter'
import { CustomExceptionFilter } from '@/common/exception-filters/custom-exception.filter'
import { UserActivityGuard } from '@/common/guards/user-activity.guard'
import { UserService } from '@/features/user/user.service'
import { HttpService } from '@infra-node-kit/http'
import { ConfigService } from '@nestjs/config'
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
    origin: ['http://localhost:8000', 'https://space.test.shopee.io', 'https://space.shopee.io'],
    methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE', 'UPDATE', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Content-Length',
      'Accept-Encoding',
      'X-CSRF-Token',
      'Authorization',
      'X-Max',
      'Content-Disposition',
      'Cookie',
    ],
    exposedHeaders: [
      'Content-Type',
      'Content-Length',
      'Accept-Encoding',
      'X-CSRF-Token',
      'Authorization',
      'X-Max',
      'Content-Disposition',
      'Cookie',
    ],
    credentials: true,
  })
  app.use(cookieParser())
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  app.enableShutdownHooks()

  const configService = app.get(ConfigService)
  const httpService = app.get(HttpService)
  const userService = app.get(UserService)

  app.setGlobalPrefix('api/v1')

  app.use(requestContextMiddleware(CommonRequestContext))
  app.useGlobalInterceptors(new WrapResponseInterceptor())
  app.useGlobalFilters(
    new UnknownExceptionFilter(),
    new HttpExceptionFilter(),
    new CustomExceptionFilter(),
  )
  app.useGlobalGuards(new UserActivityGuard(configService, httpService, userService))

  const options = new DocumentBuilder()
    .setTitle('Cell server document')
    .setDescription('Cell API description')
    .setVersion('1.0')
    .build()

  const config: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey}${methodKey.replace(/^\S/, (s) => s.toUpperCase())}`,
  }

  const swaggerDocument = SwaggerModule.createDocument(app, options, config)
  SwaggerModule.setup('api/v1/api', app, swaggerDocument)

  const port = process.env.SERVE_PORT ?? 3000

  logger.setContext('system')
  await app.listen(port)
  logger.log(`Application is running on: ${await app.getUrl()}`)
}

/*
 * async function bootstrapPrometheusApp() {
 *   const app = await NestFactory.create(PrometheusModule)
 *   await app.listen(prometheusRunningPort)
 *   logger.log(`PrometheusApp is running on: ${await app.getUrl()}`)
 * }
 */

;(async () => {
  await bootstrap()
  bootstrapZenoMonitor({ port: process.env.PORT_prometheus ?? 3001 })
  logger.log(`prometheus-----${process.env.PORT_prometheus}`)
  profiler.start({
    logLevel: profiler.LogLevel.INFO,
    appId: '92807ef2-61de-4790-9d3d-e49ba53e42bd',
    appSecret: '179f1760f03c8161897c6e551d09ead22ef67dc1d4c1198d24eb5443e2d0273e',
  })
  // await bootstrapPrometheusApp()
  logger.log('Application start is complete')
})()

process.on('unhandledRejection', (err: Error) => {
  logger.error(`unhandledRejection: \n${err.stack}`)
})

process.on('uncaughtException', (err: Error) => {
  logger.error(`uncaughtException: \n${err.stack}`)
})
