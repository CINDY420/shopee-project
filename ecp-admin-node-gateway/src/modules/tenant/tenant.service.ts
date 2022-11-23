import { Injectable } from '@nestjs/common'
import { EcpApisService } from '@/shared/ecp-apis/ecp-apis.service'
import { SpaceCMDBService } from '@/shared/space-cmdb/space-cmdb.service'

@Injectable()
export class TenantService {
  constructor(
    private readonly ecpApisService: EcpApisService,
    private readonly spaceCMDBService: SpaceCMDBService,
  ) {}

  async getTenantList() {
    const { tenants } = await this.spaceCMDBService.tryFetch(
      'GET/apis/cmdb/v2/service/tenant/get',
      {
        show_details: true,
      },
    )
    return tenants.map((tenant) => ({
      id: tenant.tenant_id,
      name: tenant.tenant_name,
      managers: tenant.engineering_managers?.map((manager) => ({
        id: manager.user_id,
        email: manager.user_email,
        teamIds: manager.team_ids,
      })),
    }))
  }
}
