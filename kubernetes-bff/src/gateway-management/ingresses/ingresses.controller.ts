import { Controller, Get, Query, Param } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'
import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { GetOrUpdateNameParamsDto } from 'platform-management/clusters/dto/common/params.dto'
import { IngressListResponseDto, GetClusterIngressesQueryDto } from './dto'

import { IngressesService } from './ingresses.service'

@ApiTags('Ingresses')
@Controller()
export class IngressesController {
  constructor(private readonly ingressesService: IngressesService) {}

  @Get('clusters/:clusterName/ingresses')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.INGRESS)
  @ApiResponse({ status: 200, type: IngressListResponseDto, description: 'List cluster ingresses info' })
  async getClusterIngresses(
    @Query() queryParams: GetClusterIngressesQueryDto,
    @Param() params: GetOrUpdateNameParamsDto
  ): Promise<IngressListResponseDto> {
    const { clusterName } = params
    return this.ingressesService.listClusterIngresses(clusterName, queryParams)
  }

  @Get('ingresses/tree')
  @ApiResponse({ status: 200, type: [String], description: 'Get cluster ingresses tree' })
  getIngressesTree() {
    return this.ingressesService.tree()
  }
}
