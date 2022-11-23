import { DeployConfigService } from '@/features/deploy-config/deploy-config.service'
import { UpdateDeployConfigBodyDto } from '@/features/deploy-config/dto/update-deploy-config.dto'
import {
  GetDeployConfigParams,
  GetDeployConfigQuery,
  GetDeployConfigResponse,
} from '@/features/deploy-config/dto/get-deploy-config.dto'
import { Controller, Get, Param, Query, Body, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ListAvailableZonesResponse } from '@/features/deploy-config/dto/list-available-zone.dto'
import { ListComponentResponse } from '@/features/deploy-config/dto/list-components.dto'
import {
  ListDeployConfigEnvsResponse,
  ListExtraConfigsResponse,
} from '@/features/deploy-config/dto/list-extra-configs.dto'

@ApiTags('DeployConfig')
@Controller('/tenants/:tenantId/projects/:projectName/applications/:appName/deploy-config')
export class DeployConfigController {
  constructor(private readonly deployConfigService: DeployConfigService) {}

  @Put()
  updateDeployConfig(@Param() params: GetDeployConfigParams, @Body() body: UpdateDeployConfigBodyDto) {
    return this.deployConfigService.updateDeployConfig(params, body)
  }

  @Get()
  getDeployConfig(
    @Param() params: GetDeployConfigParams,
    @Query() query: GetDeployConfigQuery,
  ): Promise<GetDeployConfigResponse> {
    return this.deployConfigService.getDeployConfig(params, query)
  }

  @Get('resources/available-zones')
  listAvailableZones(
    @Param() _: GetDeployConfigParams,
    @Query() query: GetDeployConfigQuery,
  ): Promise<ListAvailableZonesResponse> {
    return this.deployConfigService.listAvailableZones(query)
  }

  @Get('resources/components')
  listComponents(
    @Param() _: GetDeployConfigParams,
    @Query() query: GetDeployConfigQuery,
  ): Promise<ListComponentResponse> {
    return this.deployConfigService.listComponents(query)
  }

  @Get('resources/extra-configs')
  listExtraConfigs(@Param() _: GetDeployConfigParams): Promise<ListExtraConfigsResponse> {
    return this.deployConfigService.listExtraConfigs()
  }

  @Get('resources/deployConfigEnvs')
  listDeployConfigEnvs(@Param() _: GetDeployConfigParams): Promise<ListDeployConfigEnvsResponse> {
    return this.deployConfigService.listDeployConfigEnvs()
  }
}
