import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TenantService {
  constructor(private readonly configService: ConfigService) {}

  listEnableHybridDeployTenants() {
    const tenants =
      this.configService.get<number[]>('ecpGlobalConfig.enableHybridDeployTenants') || []
    return {
      tenants,
      total: tenants.length,
    }
  }
}
