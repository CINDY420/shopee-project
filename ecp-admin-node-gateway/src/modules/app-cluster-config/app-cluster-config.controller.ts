import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AppClusterConfigService } from '@/modules/app-cluster-config/app-cluster-config.service'
import {
  AddAppClusterConfigsBody,
  ListAppClusterConfigsResponse,
  ListAppClusterConfigsQuery,
  RemoveAppClusterConfigParam,
  AddAppClusterConfigsResponse,
  RemoveAppClusterConfigsBody,
} from '@/modules/app-cluster-config/app-cluster-config.dto'

@ApiTags('AppClusterConfig')
@Controller()
export class AppClusterConfigController {
  constructor(private readonly appClusterConfigService: AppClusterConfigService) {}

  @Get('appClusterConfigs')
  listAppClusterConfigs(
    @Query() query: ListAppClusterConfigsQuery,
  ): Promise<ListAppClusterConfigsResponse> {
    return this.appClusterConfigService.listAppClusterConfigs(query)
  }

  @Post('appClusterConfigs[:]batchAdd')
  async addAppClusterConfigs(
    @Body() addAppClusterConfigsBody: AddAppClusterConfigsBody,
  ): Promise<AddAppClusterConfigsResponse> {
    return {
      ids: await this.appClusterConfigService.batchAddAppClusterConfig(
        addAppClusterConfigsBody.configs,
      ),
    }
  }

  @Delete('appClusterConfigs/:id')
  removeAppClusterConfig(
    @Param() removeAppClusterConfigParam: RemoveAppClusterConfigParam,
  ): Promise<void> {
    return this.appClusterConfigService.removeAppClusterConfig(removeAppClusterConfigParam.id)
  }

  @Post('appClusterConfigs[:]batchRemove')
  removeAppClusterConfigs(
    @Body() removeAppClusterConfigsBody: RemoveAppClusterConfigsBody,
  ): Promise<void> {
    return this.appClusterConfigService.batchRemoveAppClusterConfig(
      removeAppClusterConfigsBody.idList,
    )
  }
}
