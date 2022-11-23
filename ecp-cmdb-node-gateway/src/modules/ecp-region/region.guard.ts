import { DEFAULT_REGION, ECP_REGION_PROPERTY_KEY } from '@/modules/ecp-region/constants'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class EcpRegionGuard implements CanActivate {
  // eslint-disable-next-line class-methods-use-this
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { headers: { [ECP_REGION_PROPERTY_KEY]: string } }>()
    if (!request.headers[ECP_REGION_PROPERTY_KEY]) {
      request.headers[ECP_REGION_PROPERTY_KEY] = DEFAULT_REGION
      return true
    }

    return true
  }
}
