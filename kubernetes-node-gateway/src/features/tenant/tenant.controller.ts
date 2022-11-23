import { ListEnableHybridDeployTenantsResponse } from '@/features/tenant/dto/list-enable-hybrid-deploy-tenants.dto'
import { TenantService } from '@/features/tenant/tenant.service'
import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Tenant')
@Controller()
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('tenant[:]enableHybridDeployTenants')
  listEnableHybridDeployTenants(): Promise<ListEnableHybridDeployTenantsResponse> {
    return this.tenantService.listEnableHybridDeployTenants()
  }
}
