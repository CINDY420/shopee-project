import { Controller, Get, Query, HttpStatus, Post, Body, Param, Patch } from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'
import { OpenApiService } from '@/common/modules/openApi/openApi.service'
import { TenantService } from '@/features/tenant/tenant.service'

import {
  GetTenantResponse,
  IOpenApiBatchUpdateTenantFusePayload,
  UpdateTenantResponse,
} from '@/common/dtos/openApi/tenant.dto'

import {
  ListTenantsQuery,
  ListTenantsResponse,
  CreateTenantPayload,
  GetTenantParams,
  UpdateTenantPayload,
  UpdateTenantParams,
  UpdateTenantsPayload,
} from '@/features/tenant/dto/tenant.dto'

@ApiTags('Tenant')
@Controller('tenants')
export class TenantController {
  constructor(private readonly openApiService: OpenApiService, private readonly tenantService: TenantService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: ListTenantsResponse, description: 'List tenants' })
  listTenants(@Query() listTenantsQuery: ListTenantsQuery) {
    return this.tenantService.listTenants(listTenantsQuery)
  }

  @Get('cmdbTenants')
  listAllCMDBTenants() {
    return this.openApiService.listAllCMDBTenants()
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateTenantPayload, description: 'Create tenant' })
  CreateTenant(@Body() createTenantPayload: CreateTenantPayload) {
    const { tenantCmdbName, tenantCmdbId, envQuotas, description, oversoldRatio } = createTenantPayload
    return this.openApiService.createTenant({
      tenantCmdbName,
      tenantCmdbId,
      envQuotas,
      description,
      oversoldRatio,
    })
  }

  @Get(':tenantId')
  @ApiResponse({ status: HttpStatus.OK, type: GetTenantResponse, description: 'Get tenant' })
  GetTenant(@Param() getTenantParams: GetTenantParams) {
    const { tenantId } = getTenantParams
    return this.openApiService.getTenant(tenantId)
  }

  @Patch('tenant/:tenantId')
  @ApiResponse({ status: HttpStatus.OK, type: UpdateTenantResponse, description: 'Update tenant' })
  UpdateTenant(@Param() updateTenantParams: UpdateTenantParams, @Body() updateTenantPayload: UpdateTenantPayload) {
    const { tenantId } = updateTenantParams
    const { description, envQuotas, tenantCmdbName, oversoldRatio } = updateTenantPayload
    return this.openApiService.updateTenant(tenantId, {
      description,
      envQuotas,
      tenantCmdbName,
      oversoldRatio,
    })
  }

  @Patch()
  @ApiResponse({ description: 'Update tenants' })
  UpdateTenants(@Body() updateTenantsPayload: UpdateTenantsPayload) {
    return this.tenantService.updateTenants(updateTenantsPayload)
  }

  @Patch('[:]fuse')
  @ApiResponse({ description: 'Update tenant fuses' })
  BatchUpdateTenantFuses(@Body() updateTenantsPayload: IOpenApiBatchUpdateTenantFusePayload) {
    return this.openApiService.batchUpdateTenantFuses(updateTenantsPayload)
  }
}
