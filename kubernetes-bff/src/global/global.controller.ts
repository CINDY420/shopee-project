import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'
import { GlobalService } from './global.service'

import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'
import { IMetadataResponse, IGetResourceParams, IGlobalDataResponse, IResourceResponse } from './dto/global.dto'
import { AuthToken } from 'common/decorators/parameters/AuthToken'
import { AuthService } from 'common/modules/auth/auth.service'
import { AuthUser, IAuthUser } from 'common/decorators/parameters/AuthUser'

@ApiTags('Global')
@Controller('')
export class GlobalController {
  constructor(private readonly globalService: GlobalService, private readonly authService: AuthService) {}

  @Get('metadata')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.CLUSTER)
  @ApiResponse({ status: 200, type: IMetadataResponse, description: 'Get global metadata' })
  getMetaData() {
    return this.globalService.getMetaData()
  }

  @Get('cids')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.ENV)
  @ApiResponse({ status: 200, type: IGlobalDataResponse, description: 'Get global cids' })
  getCids() {
    return this.globalService.getCids()
  }

  @Get('envs')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.ENV)
  @ApiResponse({ status: 200, type: IGlobalDataResponse, description: 'Get global envs' })
  getEnvs() {
    return this.globalService.getEnvs()
  }

  @Get('grps')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.GROUP)
  @ApiResponse({ status: 200, type: IGlobalDataResponse, description: 'Get global groups' })
  async getGroups(@AuthToken() authToken: string) {
    // return this.globalService.getGroups()
    const { tenants } = await this.authService.getAllTenants(authToken)

    const tenantNames = tenants.map((tenant) => tenant.name)

    return {
      items: tenantNames,
      count: tenantNames.length
    }
  }

  @Get('resources')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.APPLICATION)
  @ApiResponse({ status: 200, type: IResourceResponse, description: 'Get applications and pods from all' })
  getResources(@Query() params: IGetResourceParams, @AuthUser() authUser: IAuthUser, @AuthToken() authToken: string) {
    return this.globalService.getResources(authUser, params.searchBy, authToken)
  }

  @Get('templateType')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.TEMPLATE_TYPE)
  @ApiResponse({ status: 200, type: IGlobalDataResponse, description: 'Get deploy config template types ' })
  getTemplateType() {
    return this.globalService.getTemplateTypes()
  }
}
