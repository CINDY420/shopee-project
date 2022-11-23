import { ListEnableHybridDeployTenantsResponse } from '@/modules/tenant/dto/list-enable-hybrid-deploy-tenants.dto'
import { TenantService } from '@/modules/tenant/tenant.service'
import { RequireLogin } from '@infra-node-kit/space-auth'
import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Tenant')
@RequireLogin(true)
@Controller()
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('tenants[:]enableHybridDeployTenants')
  listEnableHybridDeployTenants(): ListEnableHybridDeployTenantsResponse {
    return this.tenantService.listEnableHybridDeployTenants()
  }
}
