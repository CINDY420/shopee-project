import { randomUUID } from 'crypto'
import { ElasticsearchModule as BaseElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch'
import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { throwError } from '@/common/utils/throw-error'
import { ERROR } from '@/common/constants/error'
import { Logger } from '@/common/utils/logger'
import { format } from 'util'

export interface IElasticsearchConfig {
  protocol: string
  host: string
  port?: string
}

@Module({
  imports: [
    BaseElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const elasticsearchConfig = configService.get<IElasticsearchConfig>('es')
        if (!elasticsearchConfig) {
          throwError(ERROR.SYSTEM_ERROR.CONFIG_SERVICE.LACK_CONFIG)
        }
        const { protocol, host, port } = elasticsearchConfig
        return {
          node: `${protocol}://${host}${port ? `:${port}` : ''}`,
          generateRequestId: () => randomUUID(),
          ssl: {
            rejectUnauthorized: false,
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  exports: [BaseElasticsearchModule],
})
export class ElasticsearchModule implements OnModuleInit {
  /**
   * We could have skipped the use of a map by adding the startTimestamp to the elasticsearch request's metadata
   * but we don't know what ElasticsearchService does with the meta.request inside the lib so this is safer
   * @private
   */
  private readonly requestStartTimestampMap: Map<string, number> = new Map()

  constructor(private readonly elasticsearchClient: ElasticsearchService, private readonly logger: Logger) {
    logger.setContext(ElasticsearchModule.name)
  }

  onModuleInit() {
    this.elasticsearchClient.on('request', (apiError, requestMeta) => {
      const requestId: string = requestMeta.meta.request.id

      if (apiError) {
        this.logger.error(`elasticsearch request: ${requestId} error: ${apiError.stack}`)
        return
      }

      this.logger.log(`elasticsearch request: ${requestId} start`)
      this.requestStartTimestampMap.set(requestId, Date.now())
    })

    this.elasticsearchClient.on('response', (apiError, requestMeta) => {
      const {
        statusCode,
        meta: {
          request: { id },
          attempts,
        },
      } = requestMeta

      const startTimestamp = this.requestStartTimestampMap.get(id)
      if (!startTimestamp) {
        this.logger.warn(`elasticsearch request: ${id} warning: Response has an unknown request id`)
        return
      }
      this.requestStartTimestampMap.delete(id)

      const duration = Date.now() - startTimestamp
      const responseContentLength: string = requestMeta.headers?.['content-length'] ?? '0'
      const message = format(
        'elasticsearch request %s end with %s (retry %s times), cost %s ms, content-length: %s ',
        id,
        statusCode,
        attempts,
        duration,
        responseContentLength,
      )
      if (apiError) {
        this.logger.error(`${message} - ${apiError?.stack}`)
        return
      }
      this.logger.log(message)
    })
  }
}
