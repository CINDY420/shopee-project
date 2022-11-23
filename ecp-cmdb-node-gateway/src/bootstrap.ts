import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { AppModule } from '@/app.module'
import { exceptionFactory } from '@/helpers/utils/validation-pipe-exception-factory'
import { applyConfig } from '@infra-node-kit/core'
import { InfraConfig } from './infra.config'
import {
  initMetrics,
  PrometheusMiddleware,
  PrometheusModule,
} from '@infra-node-kit/prometheus-nest'
import { createLoggerService, createLogger } from '@infra-node-kit/logger'
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger'
import { apm } from '@/modules/apm'
import * as profiler from '@zeno/agent-profiler'

const loggerService = createLoggerService()
const logger = createLogger()
const isTest = process.env.NODE_ENV === 'test'
const BUSINESS_PORT = 3000

async function bootstrapMainApp() {
  const app = await applyConfig(InfraConfig).createApp(AppModule, {
    logger: loggerService,
  })
  app.use(PrometheusMiddleware)

  app.setGlobalPrefix('api/ecp-cmdb')

  app.use(cookieParser())

  app.enableCors({
    origin: true,
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      forbidUnknownValues: false,
      stopAtFirstError: true,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory,
    }),
  )

  const options = new DocumentBuilder()
    .setTitle('ECP CMDB bff document')
    .setDescription('ECP CMDB API description')
    .setVersion('1.0')
    .build()

  const config: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey}${methodKey.replace(/^\S/, (s) => s.toUpperCase())}`,
  }

  if (isTest) {
    app.use(apm.middleware.connect())
  }

  const swaggerDocument = SwaggerModule.createDocument(app, options, config)
  SwaggerModule.setup('api/ecp-cmdb', app, swaggerDocument)

  await app.listen(BUSINESS_PORT)
  logger.info(`Application is running on: ${await app.getUrl()}, NODE_ENV=${process.env.NODE_ENV}`)
  return app
}

async function bootstrapPrometheusApp() {
  const app = await NestFactory.create(
    PrometheusModule.forRoot({
      metricsPath: '/metrics',
    }),
  )
  initMetrics()
  await app.listen(2020)
}

function bootstrapApm() {
  if (isTest) {
    try {
      const opt = {
        serviceName: 'ecp-bff',
        secretToken: '',
        serverUrl: 'http://apm-server.ecp-monitor:8200',
        instrument: true,
        instrumentIncomingHTTPRequests: true,
        captureBody: 'all' as const,
      }

      apm.start(opt)
    } catch (err) {
      logger.info(`set up apm with err: ${err instanceof Error ? err.stack : ''}`)
    }

    if (apm.isStarted()) {
      logger.info('APM start ok..')
    }
  }
}

function listenError() {
  process.on('unhandledRejection', (err: Error) => {
    logger.error(`unhandledRejection: ${err.stack}`)
  })

  process.on('uncaughtException', (err: Error) => {
    logger.error(`uncaughtException: ${err.stack}`)
  })
}

export async function startServer() {
  listenError()
  bootstrapApm()
  await bootstrapMainApp()
  await bootstrapPrometheusApp()
  profiler.start({
    logLevel: profiler.LogLevel.INFO,
    appId: 'e47dde69-8af4-46eb-ae6a-dea1e2aba944',
    appSecret: '2615eb80335476e581f862746661f30cf4b564bd507ca4f21863b05581af8bae',
  })
  logger.info('Application start is complete')
}
