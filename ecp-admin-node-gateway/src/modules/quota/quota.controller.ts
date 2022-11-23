import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  GetSegmentQuotaParams,
  GetSegmentQuotaQuery,
  GetSegmentQuotaResponse,
  ListTenantsQuotaParams,
  ListTenantsQuotaQuery,
  ListTenantsQuotaResponse,
  SwitchQuotaBody,
  SwitchQuotaParam,
  UpdateSegmentQuotaBody,
  UpdateSegmentQuotaParams,
  UpdateTenantsQuotaBody,
  ListTenantsQuotableEnvsResponse,
} from '@/modules/quota/dto/quota.dto'
import { QuotaService } from '@/modules/quota/quota.service'

@ApiTags('SegmentQuota')
@Controller('quota/azs/:azKey/segments/:segmentKey')
export class QuotaController {
  constructor(private readonly quotaService: QuotaService) {}

  @Get('tenants')
  listTenantsQuota(
    @Param() param: ListTenantsQuotaParams,
    @Query() query: ListTenantsQuotaQuery,
  ): Promise<ListTenantsQuotaResponse> {
    return this.quotaService.listTenantsQuota(param, query)
  }

  @Get('tenants/quotableEnvs')
  listTenantsQuotableEnvs(
    @Param() param: ListTenantsQuotaParams,
  ): Promise<ListTenantsQuotableEnvsResponse> {
    return this.quotaService.listTenantsQuotableEnvs(param)
  }

  @Put('tenants')
  updateTenantsQuota(@Param() param: ListTenantsQuotaParams, @Body() body: UpdateTenantsQuotaBody) {
    return this.quotaService.updateTenantsQuota(param, body)
  }

  @Get()
  getSegmentQuota(
    @Param() param: GetSegmentQuotaParams,
    @Query() query: GetSegmentQuotaQuery,
  ): Promise<GetSegmentQuotaResponse> {
    return this.quotaService.getSegmentQuota(param, query)
  }

  @Put()
  updateSegmentQuota(
    @Param() param: UpdateSegmentQuotaParams,
    @Body() body: UpdateSegmentQuotaBody,
  ) {
    return this.quotaService.updateSegmentQuota(param, body)
  }

  @Put('envs/:env[:]switch')
  switchSegmentEnvQuota(@Param() param: SwitchQuotaParam, @Body() body: SwitchQuotaBody) {
    return this.quotaService.switchSegmentEnvQuota(param, body)
  }
}
