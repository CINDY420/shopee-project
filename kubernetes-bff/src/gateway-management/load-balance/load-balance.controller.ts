import { Controller, Get, Query, Post, Body } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import {
  GetInfoQueryDto,
  GetInfoResponseDto,
  GetTemplateResponseDto,
  RenderTemplateBodyDto,
  RenderTemplateResponseDto
} from './dto/load-balance.dto'

import { typeEnvsMap, cids, typeClustersMap, frontendTemplate, backendTemplate } from 'common/constants/loadBalance'
import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'

import { LoadBalanceService } from './load-balance.service'

@ApiTags('LoadBalances')
@Controller('loadbalance')
export class LoadBalanceController {
  constructor(private readonly loadBalanceService: LoadBalanceService) {}

  @Get('info')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.LOAD_BALANCE)
  @ApiResponse({ type: GetInfoResponseDto, description: 'Get load balance cluster info!' })
  getInfo(@Query() query: GetInfoQueryDto) {
    const { type } = query
    return {
      envs: typeEnvsMap[type],
      cids,
      clusters: typeClustersMap[type]
    }
  }

  @Get('template')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.LOAD_BALANCE)
  @ApiResponse({ type: GetTemplateResponseDto, description: 'Get load balance template!' })
  getTemplate() {
    return {
      frontend: frontendTemplate,
      backend: backendTemplate
    }
  }

  @Post('template/render')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.LOAD_BALANCE)
  @ApiResponse({ type: RenderTemplateResponseDto, description: 'Apply for rendering load balance template!' })
  renderTemplate(@Body() body: RenderTemplateBodyDto) {
    const renderedTemplate = this.loadBalanceService.getRenderedTemplate(body)
    return renderedTemplate
  }
}
