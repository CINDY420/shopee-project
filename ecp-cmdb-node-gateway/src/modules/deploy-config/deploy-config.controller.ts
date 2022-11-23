import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RequireLogin } from '@infra-node-kit/space-auth'
import { DeployConfigService } from '@/modules/deploy-config/deploy-config.service'
import { ListCommitsQuery, ListCommitsResponse } from '@/modules/deploy-config/dto/list-commits.dto'
import { ListExtraConfigsResponse } from '@/modules/deploy-config/dto/list-extra-configs.dto'
import {
  ListAvailableZonesQuery,
  ListAvailableZonesResponse,
} from '@/modules/deploy-config/dto/list-available-zone.dto'
import { CreateCommitBody } from '@/modules/deploy-config/dto/create-commit.dto'

@ApiTags('DeployConfig')
@RequireLogin(true)
@Controller('/deploy-config')
export class DeployConfigController {
  constructor(private deployConfigService: DeployConfigService) {}

  @Get('extra-configs')
  listExtraConfigs(): ListExtraConfigsResponse {
    return this.deployConfigService.listExtraConfigs()
  }

  @Get('available-zones')
  listAvailableZones(@Query() query: ListAvailableZonesQuery): Promise<ListAvailableZonesResponse> {
    return this.deployConfigService.listAvailableZones(query)
  }

  @Get('commits')
  listCommits(@Query() query: ListCommitsQuery): Promise<ListCommitsResponse> {
    return this.deployConfigService.listCommits(query)
  }

  @Post('commit/create')
  createCommit(@Body() body: CreateCommitBody): Promise<void> {
    return this.deployConfigService.createCommit(body)
  }
}
