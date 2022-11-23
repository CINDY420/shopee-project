import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@/common/utils/logger'

@Injectable()
export class TenantService {
  constructor(private readonly configService: ConfigService, private readonly logger: Logger) {
    this.logger.setContext(TenantService.name)
  }

  async listEnableHybridDeployTenants() {
    const tenants = this.configService.get<string[]>('globalV3.enableHybridDeployTenants') || []

    return {
      tenants,
      total: tenants.length,
    }
  }
}
