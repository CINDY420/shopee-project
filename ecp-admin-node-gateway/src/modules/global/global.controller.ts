import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { GlobalService } from '@/modules/global/global.service'
import {
  ListAllSegmentNamesResponse,
  ListAzsSegmentsResponse,
  ListAllCIDsResponse,
  ListAllEnvsResponse,
  ListAzSegmentsQuery,
  ListAllAzsResponse,
  ListEnumsResponse,
} from '@/modules/global/dto/global.dto'
import { EnumType } from '@/constants/ecpApis'

@ApiTags('Global')
@Controller()
export class GlobalController {
  constructor(private globalService: GlobalService) {}

  @Get('enums/platform')
  listAllPlatforms(): Promise<ListEnumsResponse> {
    return this.globalService.listEnumsByType(EnumType.PLATFORM)
  }

  @Get('enums/clusterType')
  listAllClusterTypes(): Promise<ListEnumsResponse> {
    return this.globalService.listEnumsByType(EnumType.CLUSTER_TYPE)
  }

  @Get('enums/azProperties')
  listAllAZProperties(): Promise<ListEnumsResponse> {
    return this.globalService.listEnumsByType(EnumType.AZ_PROPERTY)
  }

  @Get('enums/azTypes')
  listAllAZTypes(): Promise<ListEnumsResponse> {
    return this.globalService.listEnumsByType(EnumType.AZ_TYPE)
  }

  @Get('enums/ecpVersion')
  listAllEcpVersions(): Promise<ListEnumsResponse> {
    return this.globalService.listEnumsByType(EnumType.ECP_VERSION)
  }

  @Get('azs')
  listAllAzs(): Promise<ListAllAzsResponse> {
    return this.globalService.listAllAzs()
  }

  @Get('segmentNames')
  listAllSegmentNames(): Promise<ListAllSegmentNamesResponse> {
    return this.globalService.listAllSegmentNames()
  }

  @Get('azSegments')
  async listAzSegments(@Query() query: ListAzSegmentsQuery): Promise<ListAzsSegmentsResponse> {
    return {
      items: await this.globalService.listAzSegments(query.env),
    }
  }

  @Get('envs')
  async listEnvs(): Promise<ListAllEnvsResponse> {
    return {
      items: await this.globalService.listEnvs(),
    }
  }

  @Get('cids')
  async listCIDs(): Promise<ListAllCIDsResponse> {
    return {
      items: await this.globalService.listCIDs(),
    }
  }

  @Get('allAZv1s')
  listAllAZv1s(): Promise<ListEnumsResponse> {
    return this.globalService.listAllAZv1s()
  }
}
