import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IRapperApiConfig } from '@/configs/interface'

@Injectable()
export class EcpAdminConfigService {
  constructor(private readonly configService: ConfigService) {}

  getRapperURL(rapperName: string) {
    const urlMap = this.configService.get<IRapperApiConfig>(rapperName)
    return process.env.DATA_SOURCE === 'mock' ? urlMap?.mockUrl : urlMap?.baseUrl
  }
}
