import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApplicationService } from '@/modules/application/application.service'
import {
  ListApplicationsQueryScope,
  ListApplicationsQuery,
  ListApplicationsResponse,
} from '@/modules/application/application.dto'
import { throwError } from '@/helpers/utils/throw-error'
import { SYSTEM_ERROR } from '@/constants/error'

@ApiTags('Application')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get()
  async listApplications(@Query() query: ListApplicationsQuery): Promise<ListApplicationsResponse> {
    if (query.scope === ListApplicationsQueryScope.TENANT) {
      return {
        items: (await this.applicationService.getApplicationsByTenantId(query.id)) ?? [],
      }
    }
    if (query.scope === ListApplicationsQueryScope.PROJECT) {
      return {
        items: (await this.applicationService.getApplicationsByProjectId(query.id)) ?? [],
      }
    }
    const _scope: never = query.scope
    throwError(SYSTEM_ERROR.BAD_REQUEST_ERROR)
  }
}
