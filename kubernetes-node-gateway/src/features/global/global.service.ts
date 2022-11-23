import { ERROR } from '@/common/constants/error'
import { Logger } from '@/common/utils/logger'
import { throwError } from '@/common/utils/throw-error'
import { tryCatch } from '@/common/utils/try-catch'
import { Injectable } from '@nestjs/common'
import { OpenApiService } from '@/shared/open-api/open-api.service'
import { ListAZsQuery } from '@/features/global/dto/list-azs.dto'
import { ConfigService } from '@nestjs/config'
import { ListAnnouncementsQuery } from '@/features/global/dto/list-announcements.dto'
import { IAnnouncements } from '@/common/interfaces/config'

@Injectable()
export class GlobalService {
  constructor(
    private readonly openApiService: OpenApiService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext(GlobalService.name)
  }

  async listAZs(query: ListAZsQuery) {
    const { env } = query
    const [azs, error] = await tryCatch(this.openApiService.listAvailableZones(env))

    if (error || !azs) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.OPEN_API_ERROR.REQUEST_ERROR,
        `list available zones failed ${error?.message}`,
      )
    }

    return {
      azs,
      total: azs.length,
    }
  }

  async listAnnouncements(query: ListAnnouncementsQuery) {
    const { tenant = 0 } = query
    const announcements = (await this.configService.get<IAnnouncements[]>('global.announcements')) ?? []
    const selectedAnnouncements = announcements.find((item) => item.tenant === tenant)?.announcements || []

    return {
      announcements: selectedAnnouncements,
      total: selectedAnnouncements.length,
    }
  }

  async listOfflineTenants() {
    const tenants = (await this.configService.get<number[]>('global.offlineTenants')) ?? []
    return {
      tenants,
      total: tenants.length,
    }
  }
}
