import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { requestContextMiddleware } from '@medibloc/nestjs-request-context'
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger'

import { AppModule } from '@/app.module'
import { Logger } from '@/common/utils/logger'
import { CommonRequestContext } from '@/common/models/common-request-context'
import { WrapResponseInterceptor } from '@/common/interceptors/wrap-response.interceptor'
import { HttpExceptionFilter } from '@/common/exception-filters/http-exception.filter'
import { UnknownExceptionFilter } from '@/common/exception-filters/unknown-exception.filter'
import { CustomExceptionFilter } from '@/common/exception-filters/custom-exception.filter'
import { PrometheusModule } from '@/prometheus.module'
import { prometheusRunningPort } from '@/common/constants/prometheus'

import cookieParser from 'cookie-parser'

const logger = new Logger()
logger.setContext('system')

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger,
  })

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

  app.setGlobalPrefix('node-gateway/api')

  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      forbidUnknownValues: false,
      stopAtFirstError: true,
      transform: true,
    }),
  )
  app.use(cookieParser())
  app.use(requestContextMiddleware(CommonRequestContext))
  app.useGlobalInterceptors(new WrapResponseInterceptor())
  app.useGlobalFilters(new UnknownExceptionFilter(), new HttpExceptionFilter(), new CustomExceptionFilter())

  const options = new DocumentBuilder()
    .setTitle('ksc bff document')
    .setDescription('The ksc bff API description')
    .setVersion('1.0')
    .build()

  const config: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey}${methodKey.replace(/^\S/, (s) => s.toUpperCase())}`,
  }
  const document = SwaggerModule.createDocument(app, options, config)
  SwaggerModule.setup('/node-gateway/api/swagger', app, document)

  const configService = app.get(ConfigService)
  const port = configService.get<number>('port') ?? 3000

  await app.listen(port)
  logger.log(`Application is running on: ${await app.getUrl()}`)
}

async function bootstrapPrometheusApp() {
  const app = await NestFactory.create(PrometheusModule)
  await app.listen(prometheusRunningPort)
  logger.log(`PrometheusApp is running on: ${await app.getUrl()}`)
}

;(async () => {
  await bootstrap()
  await bootstrapPrometheusApp()
  logger.log(`Application start is complete`)
})()

process.on('unhandledRejection', (err: Error) => {
  logger.error(`unhandledRejection: \n${err.stack}`)
})

process.on('uncaughtException', (err: Error) => {
  logger.error(`uncaughtException: \n${err.stack}`)
})
