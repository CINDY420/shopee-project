import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client } from '@elastic/elasticsearch'

import { IEsConfig, IEsBooleanQuery, IEsAggregateResponse } from 'common/interfaces'
import {
  ESIndex,
  ES_DEFAULT_COUNT,
  SearchResponse,
  SearchResponseHit,
  ES_DEFAULT_OFFSET,
  IndexResponse,
  ICountResponse
} from 'common/constants/es'
import { AsyncService } from 'common/services/AsyncService'

import { esBooleanQueryParamBuilder } from 'common/helpers/esQueryParamBuilder'
import { isEqual } from 'lodash'
import { Logger } from 'common/helpers/logger'
import { ERROR_MESSAGE } from 'common/constants/error'

@Injectable()
export class ESService extends AsyncService {
  private readonly logger = new Logger(ESService.name)
  client: Client

  constructor(private configService: ConfigService) {
    super()
    // init a es client
    const esConfig = this.configService.get<IEsConfig>('es')
    const { protocol, host, port } = esConfig
    const esServerUrl = `${protocol}://${host}${port ? `:${port}` : ''}`

    this.client = new Client({
      node: esServerUrl,
      ssl: {
        rejectUnauthorized: false
      }
    })
    this.client
      .ping()
      .then(() => {
        this.ready = true
        this.logger.log('Elasticsearch successfully connected')
      })
      .catch((e) => {
        this.logger.error(`${ERROR_MESSAGE.ELASTICSEARCH_ERROR} Elasticsearch not connected: ${e}`)
        process.exit(1)
      })
  }

  async onApplicationShutdown() {
    try {
      if (this.client) {
        await this.client.close()
      }
      this.logger.log('Gracefully shut down esService')
    } catch (e) {
      this.logger.error(`${ERROR_MESSAGE.ELASTICSEARCH_ERROR} Can not shut down es service for ${e}`)
    }
  }

  async initIndex(index: ESIndex | string, mappings: any) {
    try {
      const existed = await this.client.indices.exists({ index })
      if (existed.statusCode === 404) {
        await this.client.indices.create({
          index,
          body: mappings
        })
        await this.client.indices.refresh({ index })
      } else {
        const result = await this.client.indices.getMapping({ index })
        // Due to elasticsearch index lifecycle management, the key could be something other than index, like platform-backend-auth-v2-0001
        const mappingsInES = Object.values(result.body)[0].mappings
        if (!isEqual(mappingsInES, mappings.mappings)) {
          this.logger.warn(`Index ${index} ES mapping in ES not match with input mapping, update`)
          await this.client.indices.putMapping({
            index,
            body: mappings.mappings
          })
        }
      }
    } catch (e) {
      this.logger.error(
        `${ERROR_MESSAGE.ELASTICSEARCH_ERROR} es index ${index} init hit error: ${JSON.stringify(
          e.meta.body.error,
          null,
          4
        )}`
      )
    }
  }

  async matchAll<T>(
    index: ESIndex | string,
    size: number = ES_DEFAULT_COUNT,
    from: number = ES_DEFAULT_OFFSET,
    parseHits?: (hits: Array<SearchResponseHit<T>>) => any
  ): Promise<{ total: number; documents: Array<T> }> {
    try {
      const data = await this.client.search<SearchResponse<T>>({
        index,
        size,
        from,
        body: {
          query: {
            match_all: {}
          }
        }
      })
      const total = data.body.hits.total.value
      const hits: Array<SearchResponseHit<T>> = data.body.hits.hits

      return {
        total,
        documents: parseHits ? parseHits(hits) : hits.map(({ _source: source }) => source)
      }
    } catch (error) {
      this.logger.error(`${ERROR_MESSAGE.ELASTICSEARCH_ERROR} ${error.message}`)
      throw error
    }
  }

  async termQueryFirst<T = Record<string, any>>(index: ESIndex | string, key: string, value: any): Promise<T>

  async termQueryFirst<T = Record<string, any>, K extends keyof SearchResponseHit = keyof SearchResponseHit>(
    index: ESIndex | string,
    key: string,
    value: any,
    assembler: (data: SearchResponseHit<T>) => Pick<SearchResponseHit<T>, K>
  ): Promise<Pick<SearchResponseHit<T>, K>>

  async termQueryFirst<T = Record<string, any>, K extends keyof SearchResponseHit = keyof SearchResponseHit>(
    index: ESIndex | string,
    key: string,
    value: any,
    assembler?: (data: SearchResponseHit<T>) => Pick<SearchResponseHit<T>, K>
  ): Promise<Pick<SearchResponseHit<T>, K> | T> {
    try {
      const data = await this.termQuery<T>(index, key, value)
      if (data.body.hits.hits.length === 0) {
        return null
      }

      const { hits } = data.body.hits

      const matchData = hits[0]

      if (typeof assembler === 'function') {
        return assembler(matchData)
      } else {
        return matchData._source
      }
    } catch (error) {
      this.logger.error(`${ERROR_MESSAGE.ELASTICSEARCH_ERROR} ${error.message}`)
      throw error
    }
  }

  async termQuery<T>(
    index: ESIndex | string,
    key: string,
    value: string,
    size: number = ES_DEFAULT_COUNT,
    from: number = ES_DEFAULT_OFFSET
  ) {
    return this.client.search<SearchResponse<T>>({
      index,
      size,
      from,
      body: {
        query: {
          term: {
            [key]: value
          }
        }
      }
    })
  }

  async booleanQueryAll<T>(
    index: ESIndex | string,
    query: IEsBooleanQuery,
    size: number = ES_DEFAULT_COUNT,
    from: number = ES_DEFAULT_OFFSET,
    sort?: string[],
    parseHits?: (hits: Array<SearchResponseHit<T>>) => any
  ): Promise<{ total: number; documents: Array<T> }> {
    try {
      const param = esBooleanQueryParamBuilder(index, query, size, from, sort)
      const data = await this.client.search<SearchResponse<T>>(param)
      const total = data.body.hits.total.value
      const hits: Array<SearchResponseHit<T>> = data.body.hits.hits

      return {
        total,
        documents: parseHits ? parseHits(hits) : hits.map(({ _source: source }) => source)
      }
    } catch (error) {
      this.logger.error(`${ERROR_MESSAGE.ELASTICSEARCH_ERROR} ${error.message}`)
      throw error
    }
  }

  async booleanQueryFirst<T>(
    index: ESIndex | string,
    query: IEsBooleanQuery,
    parseHits?: (hits: Array<SearchResponseHit<T>>) => unknown,
    sort?: string[]
  ): Promise<T> {
    try {
      const { total, documents } = await this.booleanQueryAll<T>(index, query, 1, ES_DEFAULT_OFFSET, sort, parseHits)

      if (total === 0) {
        return null
      }

      return documents[0]
    } catch (error) {
      this.logger.error(`${ERROR_MESSAGE.ELASTICSEARCH_ERROR} ${error.message}`)
      throw error
    }
  }

  async getById<T>(index: ESIndex | string, id: string): Promise<T> {
    try {
      const response = await this.client.get<SearchResponseHit<T>>({ index, id })
      return response.body._source
    } catch (e) {
      this.logger.error(`${ERROR_MESSAGE.ELASTICSEARCH_ERROR} Get ${index} by id ${id} failed for ${e}`)
      return null
    }
  }

  async termQueryAll<T>(
    index: ESIndex | string,
    key: string,
    value: any,
    size: number = ES_DEFAULT_COUNT,
    from: number = ES_DEFAULT_OFFSET
  ): Promise<{ total: number; documents: Array<T> }> {
    try {
      const data = await this.termQuery<T>(index, key, value, size, from)
      const total = data.body.hits.total.value
      const hits: Array<SearchResponseHit<T>> = data.body.hits.hits

      return {
        total,
        documents: hits.map(({ _source: source }) => source)
      }
    } catch (error) {
      this.logger.error(`${ERROR_MESSAGE.ELASTICSEARCH_ERROR} ${error.message}`)
      throw error
    }
  }

  async index(index: ESIndex | string, body: any): Promise<IndexResponse> {
    try {
      const indexResult = await this.client.index<IndexResponse>({
        index,
        body
      })
      return indexResult.body
    } catch (error) {
      this.logger.error(`${ERROR_MESSAGE.ELASTICSEARCH_ERROR} ${error.message}`)
      throw error
    }
  }

  async update(index, id, body: any) {
    try {
      await this.client.update({
        index,
        id,
        body: {
          doc: body
        }
      })
    } catch (error) {
      this.logger.error(`${ERROR_MESSAGE.ELASTICSEARCH_ERROR} ${error.message}`)
      throw error
    }
  }

  async delete(index: ESIndex | string, id) {
    try {
      await this.client.delete({
        index,
        id
      })
    } catch (error) {
      this.logger.error(`${ERROR_MESSAGE.ELASTICSEARCH_ERROR} ${error.message}`)
      throw error
    }
  }

  // search the kinds of given key, return example: {buckets: [{ key: 'Pod', doc_count: 12903 }, { key: 'Deployment', doc_count: 24 }]}
  async aggregate(index, key: string) {
    try {
      const response = await this.client.search({
        index,
        body: {
          aggs: {
            kinds: {
              terms: {
                field: key,
                size: 10000
              }
            }
          }
        }
      })
      const kinds: IEsAggregateResponse = response.body.aggregations.kinds
      return kinds
    } catch (error) {
      this.logger.error(`${ERROR_MESSAGE.ELASTICSEARCH_ERROR} ${error.message}`)
      throw error
    }
  }

  // get the real total of a index
  async count(index: ESIndex | string, query: IEsBooleanQuery): Promise<number> {
    try {
      const param = esBooleanQueryParamBuilder(index as ESIndex, query)
      const data = await this.client.count<ICountResponse>(param)

      const count = data.body.count

      return count
    } catch (error) {
      this.logger.error(`${ERROR_MESSAGE.ELASTICSEARCH_ERROR} ${error.message}`)
      throw error
    }
  }

  async wildcardQuery<T>(
    index: ESIndex | string,
    key: string,
    value: any,
    size: number = ES_DEFAULT_COUNT,
    parseHits?: (hits: Array<SearchResponseHit<T>>) => any
  ): Promise<{ total: number; documents: Array<T> }> {
    try {
      const response = await this.client.search({
        index,
        size,
        body: {
          query: {
            wildcard: {
              [key]: { value }
            }
          }
        }
      })

      const total = response.body.hits.total.value
      const hits: Array<SearchResponseHit<T>> = response.body.hits.hits

      return {
        total,
        documents: parseHits ? parseHits(hits) : hits.map(({ _source: source }) => source)
      }
    } catch (error) {
      this.logger.error(`${ERROR_MESSAGE.ELASTICSEARCH_ERROR} ${error.message}`)
      throw error
    }
  }
}
