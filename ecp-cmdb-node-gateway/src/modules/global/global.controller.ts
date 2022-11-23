import { ListAnnouncementsResponse } from '@/modules/global/dto/list-announcements.dto'
import { ListNewDeplouConfigTenantsResponse } from '@/modules/global/dto/list-new-deploy-config-tenants.dto'
import { GlobalService } from '@/modules/global/global.service'
import { RequireLogin } from '@infra-node-kit/space-auth'
import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Global')
@RequireLogin(true)
@Controller()
export class GlobalController {
  constructor(private globalService: GlobalService) {}

  @Get('/envs')
  async getEnvs(): Promise<{ envs: string[] }> {
    return await this.globalService.getEnvs()
  }

  @Get('/azs')
  async getAzs(): Promise<{ azs: string[] }> {
    return await this.globalService.getAzs()
  }

  @Get('/cids')
  async getCids(): Promise<{ cids: string[] }> {
    return await this.globalService.getCids()
  }

  @Get('/announcements')
  listAnnouncements(): ListAnnouncementsResponse {
    return this.globalService.listAnnouncements()
  }

  @Get('/newDeplouConfigTenants')
  listNewDeplouConfigTenants(): ListNewDeplouConfigTenantsResponse {
    return this.globalService.listNewDeplouConfigTenants()
  }
}
