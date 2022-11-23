import { Injectable } from '@nestjs/common'
import { SpaceAuthService } from '@infra-node-kit/space-auth'
import { HttpService } from '@infra-node-kit/http'
import { overRideCmdbFetch } from '@/helpers/fetch/override-ecp-cmdb-fetch'
import { ConfigService } from '@nestjs/config'
import { overRideSpaceFetch } from '@/helpers/fetch/override-space-fetch'
import { EcpRegionService } from '@/modules/ecp-region'

export interface IOverConfig {
  baseURL: string
}

@Injectable()
export class FetchService {
  readonly cmdbFetch
  readonly spaceFetch
  constructor(
    private readonly spaceAuthService: SpaceAuthService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly ecpRegionService: EcpRegionService,
  ) {
    const cmdbBaseURL = this.configService.get<string>('cmdbBaseUrl') ?? ''
    const spaceBaseUrl = this.configService.get<string>('spaceBaseUrl') ?? ''
    this.cmdbFetch = overRideCmdbFetch(
      this.httpService.axiosRef,
      { baseURL: cmdbBaseURL },
      this.spaceAuthService,
      this.ecpRegionService,
    )
    this.spaceFetch = overRideSpaceFetch(
      this.httpService.axiosRef,
      { baseURL: spaceBaseUrl },
      this.spaceAuthService,
    )
  }
}
