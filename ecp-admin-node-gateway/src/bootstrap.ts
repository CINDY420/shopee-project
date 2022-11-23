import { ValidationPipe, RequestMethod } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import { createLoggerService, createLogger } from '@infra-node-kit/logger'
import { HttpService } from '@infra-node-kit/http'
import {
  initMetrics,
  PrometheusMiddleware,
  PrometheusModule,
} from '@infra-node-kit/prometheus-nest'
import { applyConfig } from '@infra-node-kit/core'

import { AppModule } from '@/app.module'
import { InfraConfig } from '@/infra.config'
import { AuthGuard } from '@/guards/auth.guard'
import * as profiler from '@zeno/agent-profiler'

const loggerService = createLoggerService()
const logger = createLogger()
const BUSINESS_PORT = 3000
const METRICS_PORT = 2022

export async function bootstrapMainApp() {
  const app = await applyConfig(InfraConfig).createApp(AppModule, {
    logger: loggerService,
  })
  app.use(PrometheusMiddleware)

  app.setGlobalPrefix('ecpadmin', {
    exclude: [{ path: 'metrics', method: RequestMethod.GET }],
  })

  app.use(cookieParser())

  app.enableCors({
    origin: true,
    credentials: true,
  })

  const configService = app.get(ConfigService)
  const httpService = app.get(HttpService)

  app.useGlobalGuards(new AuthGuard(configService, httpService))

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      transform: true,
      enableDebugMessages: true,
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('ECP Admin Apis')
    .setDescription('The ECP Admin bff API description')
    .setVersion('1.0')
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('ecpadmin/swagger', app, swaggerDocument)

  await app.listen(BUSINESS_PORT)
  logger.info(`Application is running on: ${await app.getUrl()}, NODE_ENV=${process.env.NODE_ENV}`)
  return app
}

export function listenError() {
  process.on('unhandledRejection', (err: Error) => {
    logger.error(`unhandledRejection: ${err.stack ?? err.message}`)
  })

  process.on('uncaughtException', (err: Error) => {
    logger.error(`uncaughtException: ${err.stack ?? err.message}`)
  })
}

export async function startServer() {
  listenError()
  await bootstrapMainApp()
  profiler.start({
    logLevel: profiler.LogLevel.INFO,
    appId: '555cd9c7-f039-415a-942a-760c2cc0e392',
    appSecret: '7942def8e5b50301eeee263358d485676079ffa3714007a1a36206a9d1d63341',
  })
  logger.info('Application start is complete')
}

export async function bootstrapPrometheusApp() {
  initMetrics()
  const app = await NestFactory.create(
    PrometheusModule.forRoot({
      metricsPath: '/metrics',
    }),
  )
  await app.listen(METRICS_PORT)
  logger.info(`PrometheusApp is running on: ${await app.getUrl()}`)
}
