import { Controller, Post, Param, Body, Patch, Delete, Get, Query } from '@nestjs/common'
import { HpaService } from '@/features/hpa/hpa.service'
import { ApiTags } from '@nestjs/swagger'
import {
  CreateHpaParams,
  CreateHpaBody,
  UpdateHpaParams,
  UpdateHpaBody,
  ListHPARulesResponse,
  ListHPARulesParams,
  ListHPARulesQuery,
  BatchEditHPARulesBody,
  BatchEditHPARulesParams,
  GetHpaDetailParams,
  GetHpaDetailQuery,
  GetHpaDetailResponse,
  BatchCopyHpaParams,
  BatchCopyHpaBody,
  BatchCopyHpaResponse,
  GetHpaDefaultConfigParams,
  GetHpaDefaultConfigQuery,
  GetHpaDefaultConfigResponse,
} from '@/features/hpa/dto/hpa.dto'
@ApiTags('Hpa')
@Controller('tenants/:tenantId/projects/:projectName/apps/:appName')
export class HpaController {
  constructor(private readonly hpaService: HpaService) {}

  @Post('hpa[:]create')
  CreateHpa(@Param() params: CreateHpaParams, @Body() body: CreateHpaBody): Promise<never> {
    return this.hpaService.createHpa(params, body)
  }

  @Patch('hpa')
  updateHpa(@Param() params: UpdateHpaParams, @Body() body: UpdateHpaBody): Promise<never> {
    return this.hpaService.updateHpa(params, body)
  }

  @Post('hpa[:]enable')
  enableHpa(@Param() params: BatchEditHPARulesParams, @Body() body: BatchEditHPARulesBody) {
    return this.hpaService.batchEnableHPARules(params, body)
  }

  @Post('hpa[:]disable')
  disableHpa(@Param() params: BatchEditHPARulesParams, @Body() body: BatchEditHPARulesBody) {
    return this.hpaService.batchDisableHPARules(params, body)
  }

  @Delete('hpa')
  deleteHpa(@Param() params: BatchEditHPARulesParams, @Body() body: BatchEditHPARulesBody) {
    return this.hpaService.batchDeleteHPARules(params, body)
  }

  @Get('hpas')
  listHPARules(@Param() params: ListHPARulesParams, @Query() query: ListHPARulesQuery): Promise<ListHPARulesResponse> {
    return this.hpaService.listHPARules(params, query)
  }

  @Get('hpa')
  getHpaDetail(@Param() params: GetHpaDetailParams, @Query() query: GetHpaDetailQuery): Promise<GetHpaDetailResponse> {
    return this.hpaService.getHpaDetail(params, query)
  }

  @Post('hpas[:]copy')
  batchCopyHpa(@Param() params: BatchCopyHpaParams, @Body() body: BatchCopyHpaBody): Promise<BatchCopyHpaResponse[]> {
    return this.hpaService.batchCopyHpa(params, body)
  }

  @Get('hpa/default')
  getHpaDefaultConfig(
    @Param() params: GetHpaDefaultConfigParams,
    @Query() query: GetHpaDefaultConfigQuery,
  ): Promise<GetHpaDefaultConfigResponse> {
    return this.hpaService.getHpaDefaultConfig(params, query)
  }
}
