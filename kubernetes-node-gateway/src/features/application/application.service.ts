import { Injectable } from '@nestjs/common'
import { OpenApiService } from '@/shared/open-api/open-api.service'
import {
  ListApplicationsParams,
  GetApplicationParams,
  ListApplicationsResponse,
} from '@/features/application/dto/application.dto'
import { ConfigService } from '@nestjs/config'
import { SpaceApiService } from '@/shared/space-api/space-api.service'

@Injectable()
export class ApplicationService {
  constructor(
    private readonly openApiService: OpenApiService,
    private readonly configService: ConfigService,
    private readonly spaceApiService: SpaceApiService,
  ) {}

  async listApplications(params: ListApplicationsParams): Promise<ListApplicationsResponse> {
    const { tenantId, projectName } = params
    const allApplications = await this.openApiService.listAllApplications({ tenantId, projectName })
    let tenantName = ''
    const formattedApplications = allApplications.map((application) => {
      const { name, status, cids, environments, tenantName: appTenantName } = application
      if (!tenantName) {
        tenantName = appTenantName
      }
      return {
        name,
        status,
        cids,
        environments,
      }
    })
    return {
      totalCount: formattedApplications.length,
      apps: formattedApplications,
      tenantId: Number(tenantId),
      projectName,
      tenantName,
    }
  }

  async getApplication(params: GetApplicationParams) {
    const { tenantId, projectName, appName } = params
    const application = await this.openApiService.getApplication({ tenantId, projectName, appName })
    const enableHpaTenants = this.configService.get<string[]>('globalV3.enableHpaTenants')
    const didEnableHpa = !!enableHpaTenants && enableHpaTenants.includes(tenantId)
    return { ...application, enableHpa: didEnableHpa }
  }

  async getApplicationServiceName(appName: string) {
    const { service } = await this.spaceApiService.getServiceNameByIdentifier(appName)
    const { service_name: serviceName } = service
    return {
      serviceName,
    }
  }
}
