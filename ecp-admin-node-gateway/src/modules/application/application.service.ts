import { Injectable } from '@nestjs/common'
import { EcpApisService } from '@/shared/ecp-apis/ecp-apis.service'

@Injectable()
export class ApplicationService {
  constructor(private readonly ecpApisService: EcpApisService) {}

  async getApplicationsByTenantId(tenantId: string) {
    const result = await this.ecpApisService
      .getFetch()
      ['GET/ecpapi/v2/tree/{rootType}/key/{rootKey}']({
        rootType: 'cmdb_tenant_id',
        rootKey: tenantId,
        leafType: 'application',
      })
    return result.tree?.leafKey ?? []
  }

  async getApplicationsByProjectId(projectId: string) {
    const result = await this.ecpApisService
      .getFetch()
      ['GET/ecpapi/v2/tree/{rootType}/key/{rootKey}']({
        rootType: 'project',
        rootKey: projectId,
        leafType: 'application',
      })
    return result.tree?.leafKey ?? []
  }
}
