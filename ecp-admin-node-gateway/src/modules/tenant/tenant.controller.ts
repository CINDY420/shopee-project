import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { TenantService } from '@/modules/tenant/tenant.service'
import { ListTenantResponse } from '@/modules/tenant/tenant.dto'

@ApiTags('Tenant')
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('/')
  async listTenants(): Promise<ListTenantResponse> {
    return {
      items: await this.tenantService.getTenantList(),
    }
  }
}
