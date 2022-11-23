import { CACHE_MANAGER, HttpException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

import { HTTP_AGENT } from 'common/constants/http'
import { AUTH_SERVICE_COOKIE_KEY } from 'common/constants/sessions'
import { IUssConfig, IUssRequestArgs } from 'common/interfaces/uss.interface'
import { stringify } from 'querystring'
import * as fs from 'fs'
import * as fsPromise from 'fs/promises'
import * as crypto from 'crypto'
import { CHUNK_SIZE, DEFAULT_ETAG, USS_TOKEN_CACHE_KEY } from 'common/constants/uss'
import { Stream } from 'stream'
import PQueue from 'p-queue'
import { constants as HTTP_CONSTANTS } from 'http2'
import { Logger } from 'common/helpers/logger'

const requestQueue = new PQueue({ concurrency: 100 })
@Injectable()
export class UssService {
  private readonly logger = new Logger(UssService.name)
  private readonly ussConfig: IUssConfig
  constructor(private configService: ConfigService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.ussConfig = this.configService.get<IUssConfig>('uss')
    if (!this.ussConfig) {
      this.logger.error('Can not get uss service config!')
    }
  }

  private async request<T>(requestOption: Partial<IUssRequestArgs>): Promise<T> {
    const { protocol, host, port } = this.ussConfig
    const ussApiServer = port ? `${protocol}://${host}:${port}` : `${protocol}://${host}`

    const {
      server = ussApiServer,
      resourceURI,
      version = 'v1',
      params,
      headers,
      token,
      payload,
      method = 'get',
      index,
      uid,
      connectionTime,
      email,
      podName,
      responseType,
      retryTimes = 3
    } = requestOption
    const prefix = 'api'
    const route = `${server}/${prefix}/${version}/${resourceURI}`
    const tokenHeaders = token ? { [AUTH_SERVICE_COOKIE_KEY]: token } : {}

    // handle retrying
    const ussAxios = axios.create()
    ussAxios.interceptors.response.use(null, async (err) => {
      const config = err.config
      if (!config) return Promise.reject(err)
      const { retryCount = 0, retryDelay = 1000 } = config
      config.retryCount = retryCount
      if (retryCount >= retryTimes) {
        this.logger.error(
          `${email} Retry more than 3 times: ${podName} at ${connectionTime}. SessionId: ${uid}. Error: ${err.stack}`
        )
        return Promise.reject(err)
      }
      config.retryCount++
      const delay = new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve()
        }, retryDelay)
      })
      await delay
      return ussAxios(config)
    })

    try {
      const response = await ussAxios(route, {
        paramsSerializer: (params) => {
          return stringify(params)
        },
        headers: { ...tokenHeaders, ...headers },
        params,
        httpAgent: HTTP_AGENT,
        data: payload,
        method,
        timeout: 30 * 1000,
        responseType
      })
      if (index !== undefined) {
        response.data.data.index = index
      }
      return response.data
    } catch (err) {
      const { response } = err
      if (!response) {
        throw new InternalServerErrorException(`Request failed: ${err.message}`)
      }
      const {
        status,
        data: { message }
      } = response
      throw new HttpException(message, status)
    }
  }

  private async getToken(): Promise<string> {
    const { appId, appSecret } = this.ussConfig
    let token = await this.cacheManager.get<string>(USS_TOKEN_CACHE_KEY)
    if (!token) {
      const resourceURI = 'auth/token'
      const option = {
        resourceURI,
        payload: { appId, appSecret },
        method: 'POST' as const
      }
      const { data } = await this.request(option)
      const { token: newToken } = data
      await this.cacheManager.del(USS_TOKEN_CACHE_KEY)
      await this.cacheManager.set(USS_TOKEN_CACHE_KEY, newToken, { ttl: 60 * 60 * 36 })
      token = newToken
    }
    return token
  }

  public async uploadFile(filePath: string, uid: string, connectionTime: Date, email: string, podName: string) {
    const { bucketName } = this.ussConfig
    const resourceURI = `upload/${bucketName}`
    const token = await this.getToken()

    const fileSize = (await fsPromise.stat(filePath)).size
    const chunkNumber = Math.ceil(fileSize / CHUNK_SIZE)
    const stream = fs.createReadStream(filePath, { highWaterMark: CHUNK_SIZE })
    const fileEtag = await getEtag(fs.createReadStream(filePath))

    let index = 0
    const fileIds = []
    return new Promise<string>((resolve) => {
      stream.on('readable', async () => {
        const chunk = stream.read(CHUNK_SIZE)
        if (chunk) {
          const eTag = await getEtag(chunk)
          const option = {
            method: 'POST' as const,
            token,
            resourceURI,
            version: 'v2',
            headers: {
              [HTTP_CONSTANTS.HTTP2_HEADER_CONTENT_TYPE]: 'application/octet-stream',
              Etag: eTag
            },
            index: index++,
            uid,
            connectionTime,
            email,
            podName,
            payload: chunk
          }
          const { data } = await requestQueue.add(() => this.request(option))
          fileIds.push({ index: data.index, fid: data.fid })
          if (fileIds.length === chunkNumber) {
            resolve(this.mergeFiles(fileIds, fileEtag, token))
          }
        }
      })
    })
  }

  public async mergeFiles(fileIds: Record<string, unknown>[], eTag: string, token: string) {
    const { bucketName } = this.ussConfig
    const resourceURI = `mergeFiles/${bucketName}`
    const option = {
      method: 'POST' as const,
      token,
      resourceURI,
      version: 'v2',
      headers: {
        [HTTP_CONSTANTS.HTTP2_HEADER_CONTENT_TYPE]: 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${eTag}"`,
        Etag: eTag
      },
      payload: {
        fids: fileIds
      }
    }
    const { data } = await this.request(option)
    return data.fid
  }

  public async downloadFile(fileId: string) {
    const { regionId, appId, bucketName } = this.ussConfig
    const resourceURI = `file/${regionId}/${appId}/${bucketName}/${fileId}`

    const option = {
      resourceURI,
      responseType: 'stream' as const
    }
    const response: fs.WriteStream = await this.request(option)
    return response
  }
}

// https://github.com/qiniu/qetag
const getEtag = (input: Buffer | fs.ReadStream) => {
  return new Promise<string>((resolve) => {
    const chunkSize = 4 * 1024 * 1024
    const sha1DigestBufferList: Array<Buffer> = []
    const prefix = 0x16
    let chunkCount = 0

    if (input instanceof Buffer) {
      const bufferSize = input.length
      chunkCount = Math.ceil(bufferSize / chunkSize)

      for (let i = 0; i < chunkCount; i++) {
        const temp = createSha1Digest(input.slice(i * chunkSize, (i + 1) * chunkSize))
        sha1DigestBufferList.push(temp)
      }
      resolve(calculateEtag())
    } else if (input instanceof Stream) {
      const stream = input
      stream.on('readable', function () {
        let chunk
        while ((chunk = stream.read(chunkSize))) {
          sha1DigestBufferList.push(createSha1Digest(chunk))
          chunkCount++
        }
      })
      stream.on('end', function () {
        resolve(calculateEtag())
      })
    } else {
      resolve(calculateEtag())
    }

    function createSha1Digest(content: Buffer) {
      const sha1Hash = crypto.createHash('sha1')
      sha1Hash.update(content)
      return sha1Hash.digest()
    }
    function calculateEtag() {
      if (!sha1DigestBufferList.length) {
        return DEFAULT_ETAG
      }
      let sha1Buffer = Buffer.concat(sha1DigestBufferList, chunkCount * 20)

      if (chunkCount > 1) {
        // prefix = 0x96
        sha1Buffer = createSha1Digest(sha1Buffer)
      }

      sha1Buffer = Buffer.concat([Buffer.from([prefix]), sha1Buffer], sha1Buffer.length + 1)

      return sha1Buffer.toString('base64').replace(/\//g, '_').replace(/\+/g, '-')
    }
  })
}
