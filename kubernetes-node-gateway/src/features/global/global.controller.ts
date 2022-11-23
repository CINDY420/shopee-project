import { ListAZsQuery, ListAZsResponse } from '@/features/global/dto/list-azs.dto'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GlobalService } from '@/features/global/global.service'
import { ListAnnouncementsQuery, ListAnnouncementsResponse } from '@/features/global/dto/list-announcements.dto'
import { ListOfflineTenantsResponse } from '@/features/global/dto/list-offline-tenants.dto'

@ApiTags('Global')
@Controller('global')
export class GlobalController {
  constructor(private readonly globalService: GlobalService) {}

  @Get('azs')
  listAZs(@Query() query: ListAZsQuery): Promise<ListAZsResponse> {
    return this.globalService.listAZs(query)
  }

  @Get('announcements')
  listAnnouncements(@Query() query: ListAnnouncementsQuery): Promise<ListAnnouncementsResponse> {
    return this.globalService.listAnnouncements(query)
  }

  @Get('offlineTenants')
  listOfflineTenants(): Promise<ListOfflineTenantsResponse> {
    return this.globalService.listOfflineTenants()
  }
}
