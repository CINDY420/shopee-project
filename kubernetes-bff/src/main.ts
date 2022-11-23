import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrometheusAppModule } from 'prometheusApp/prometheusApp.module'
import { applicationBootstrap } from 'bootstrap'
import { apm } from './apm'
import { Logger } from 'common/helpers/logger'
import * as profiler from '@zeno/agent-profiler'

const logger = new Logger()
logger.setContext('system')

async function bootstrap() {
  const isLocal = process.env.NODE_ENV === 'local'
  const app = isLocal ? await NestFactory.create(AppModule) : await NestFactory.create(AppModule, { logger })

  await applicationBootstrap(app)

  // app.use(apm.middleware.connect())
  await app.listen(3000)
  logger.log('server is running at 3000 port!')
}

// A prometheus server
async function prometheusBootstrap() {
  const app = await NestFactory.create(PrometheusAppModule)

  await app.listen(2020)
}

async function apmBootStrap() {
  try {
    const opt = {
      serviceName: 'BFF',
      secretToken: '',
      serverUrl: 'http://apm-server.ske-database:8200',
      instrument: true,
      instrumentIncomingHTTPRequests: true,
      captureBody: 'all',
      active: process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'live'
    }

    apm.start(opt)
  } catch (err) {
    logger.error(`set up apm with err: ${err.stack}`)
  }
}

;(async () => {
  // await apmBootStrap()
  await bootstrap()
  prometheusBootstrap()
  profiler.start({
    logLevel: profiler.LogLevel.INFO,
    appId: 'ba6c7d8a-5734-4df8-94b8-51159b915b0e',
    appSecret: '0a652d02d552674b950c7d2cad87ec0aee5fce27534611d254247162f617d575'
  })
})()

process.on('unhandledRejection', (err: Error) => {
  logger.error(`unhandledRejection: \n${err.stack}`)
})

process.on('uncaughtException', (err: Error) => {
  logger.error(`uncaughtException: \n${err.stack}`)
})
