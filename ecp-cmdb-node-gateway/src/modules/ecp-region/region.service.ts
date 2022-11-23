import { ECP_REGION_PROPERTY_KEY } from '@/modules/ecp-region/constants'
import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { logger } from '@infra-node-kit/logger'
import { Request } from 'express'

@Injectable()
export class EcpRegionService {
  constructor(
    @Inject(REQUEST) private request: Request & { headers: { [ECP_REGION_PROPERTY_KEY]: string } },
  ) {}

  getEcpRegion(): string | null {
    if (!this.request.headers[ECP_REGION_PROPERTY_KEY]) {
      logger.warn('cann not get ecp-region in header')
    }

    return this.request.headers[ECP_REGION_PROPERTY_KEY]
  }
}
