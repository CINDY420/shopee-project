import { Injectable } from '@nestjs/common'
import { EcpApisService } from '@/shared/ecp-apis/ecp-apis.service'

@Injectable()
export class ProjectService {
  constructor(private readonly ecpApisService: EcpApisService) {}

  async getProjectsByTenantId(tenantId: string) {
    const result = await this.ecpApisService
      .getFetch()
      ['GET/ecpapi/v2/tree/{rootType}/key/{rootKey}']({
        // cmdb_tenant_id / project
        rootType: 'cmdb_tenant_id',
        // for cmdb_tenant, use cmdb_tenant_id
        rootKey: tenantId,
        // project,application
        leafType: 'project',
      })
    return result.tree?.leafKey ?? []
  }
}
