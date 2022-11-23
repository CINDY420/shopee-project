import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  EksListAllAzSegmentResponse,
  EksListAllEnvsResponse,
  EksListAllTemplatesResponse,
  EksListAllSpaceTenantsResponse,
  EksListAllSpaceTenantProductsResponse,
  EksListAllSpaceTenantProductsParams,
  EksListAllPlatformsResponse,
  EksListAllKubernetesVersionsResponse,
  EksListAllVpcsResponse,
  EksListAllVpcsQuery,
  EksGetTemplateDetailParam,
  EksGetTemplateDetailResponse,
} from '@/modules/eks-enums/dto/eks-enums.dto'
import { EksEnumsService } from '@/modules/eks-enums/eks-enums.service'

@ApiTags('EksEnums')
@Controller('eks/enums')
export class EksEnumsController {
  constructor(private readonly eksEnumService: EksEnumsService) {}

  @Get('azSegments')
  listAllAzSegment(): Promise<EksListAllAzSegmentResponse> {
    return this.eksEnumService.listAllAzSegment()
  }

  @Get('envs')
  listAllEnvs(): Promise<EksListAllEnvsResponse> {
    return this.eksEnumService.listAllEnvs()
  }

  @Get('templates')
  listAllTemplates(): Promise<EksListAllTemplatesResponse> {
    return this.eksEnumService.listAllTemplates()
  }

  @Get('templates/:templateId')
  getTemplateDetail(
    @Param() param: EksGetTemplateDetailParam,
  ): Promise<EksGetTemplateDetailResponse> {
    return this.eksEnumService.getTemplateDetail(Number(param.templateId))
  }

  @Get('space/tenants')
  listAllSpaceTenants(): Promise<EksListAllSpaceTenantsResponse> {
    return this.eksEnumService.listAllSpaceTenants()
  }

  @Get('space/tenants/:tenantName/products')
  listAllSpaceTenantProducts(
    @Query() query: EksListAllSpaceTenantProductsParams,
  ): Promise<EksListAllSpaceTenantProductsResponse> {
    return this.eksEnumService.listAllSpaceTenantProducts(query.tenantName)
  }

  @Get('platforms')
  listAllPlatforms(): Promise<EksListAllPlatformsResponse> {
    return this.eksEnumService.listAllPlatforms()
  }

  @Get('kubernetesVersion')
  listAllKubernetesVersions(): Promise<EksListAllKubernetesVersionsResponse> {
    return this.eksEnumService.listAllKubernetesVersions()
  }

  @Get('vpcs')
  listAllVpcs(@Query() query: EksListAllVpcsQuery): Promise<EksListAllVpcsResponse> {
    return this.eksEnumService.listAllVpcs(query.platformID, query.az)
  }
}
