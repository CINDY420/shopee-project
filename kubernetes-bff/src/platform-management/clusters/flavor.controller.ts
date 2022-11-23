import { Controller, Get, Param, Post, Body, ForbiddenException } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'
import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { AuthToken } from 'common/decorators/parameters/AuthToken'
import { OpenApiService } from 'common/modules/openApi/openApi.service'
import { ClusterFlavorResponse, AddClustersFlavorsRequest, UpdateClusterFlavorsRequest } from './dto/flavor.dto'
import { GetOrUpdateNameParamsDto } from './dto/common/params.dto'
import { AuthService } from 'common/modules/auth/auth.service'
import { AuthUser, IAuthUser } from 'common/decorators/parameters/AuthUser'
import { RBACCheckTenantResourceAction } from 'common/helpers/rbac'
import { RESOURCE_TYPE, RESOURCE_ACTION, PLATFORM_TENANT_ID } from 'common/constants/rbac'
import { Logger } from 'common/helpers/logger'

@ApiTags('flavor')
@Controller()
export class FlavorController {
  private logger: Logger = new Logger(FlavorController.name)

  constructor(private readonly openapiService: OpenApiService, private readonly authService: AuthService) {}

  @Get('flavors')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.CLUSTER)
  @ApiResponse({ status: 200, type: ClusterFlavorResponse, description: 'Get default Flavors of Cluster' })
  async getDefaultFlavors(@AuthToken() authToken: string) {
    const response = await this.openapiService.getClusterFlavors('default', authToken)
    const { flavors = [] } = response as ClusterFlavorResponse
    // sort cpu and memory by value
    const orderedFlavors = flavors.sort((pre, cur) => {
      const { cpu: preCpu, memory: preMemory } = pre
      const { cpu: curCpu, memory: curMemory } = cur
      if (preCpu === curCpu) {
        return preMemory - curMemory
      }
      return preCpu - curCpu
    })

    return { flavors: orderedFlavors }
  }

  @Get('clusters/:clusterName/flavors')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.CLUSTER)
  @ApiResponse({ status: 200, type: ClusterFlavorResponse, description: 'Get Flavors of Cluster' })
  async getClusterFlavors(@Param() params: GetOrUpdateNameParamsDto, @AuthToken() authToken: string) {
    const { clusterName } = params
    const response = await this.openapiService.getClusterFlavors(clusterName, authToken)
    const { flavors = [] } = response as ClusterFlavorResponse
    // sort cpu and memory by value
    const orderedFlavors = flavors.sort((pre, cur) => {
      const { cpu: preCpu, memory: preMemory } = pre
      const { cpu: curCpu, memory: curMemory } = cur
      if (preCpu === curCpu) {
        return preMemory - curMemory
      }
      return preCpu - curCpu
    })

    return { flavors: orderedFlavors }
  }

  @Post('clusters/flavors')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.CLUSTER)
  @ApiResponse({ status: 200, type: 'success', description: 'add clusters flavors' })
  async addClustersFlavors(
    @Body() body: AddClustersFlavorsRequest,
    @AuthUser() authUser: IAuthUser,
    @AuthToken() authToken: string
  ) {
    const permissions = await this.authService.getTenantPermissions(authUser.roles, authToken)
    const hasPermission = RBACCheckTenantResourceAction(
      permissions,
      PLATFORM_TENANT_ID,
      RESOURCE_TYPE.CLUSTER,
      RESOURCE_ACTION.Edit
    )
    if (!hasPermission) {
      throw new ForbiddenException('you do not have permission to do this operations')
    }
    return this.openapiService.addClustersFlavors(body, authToken)
  }

  @Post('clusters/:clusterName/flavors')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.CLUSTER)
  @ApiResponse({ status: 200, type: '', description: 'update cluster flavors' })
  async updateClusterFlavors(
    @Body() body: UpdateClusterFlavorsRequest,
    @Param() param: GetOrUpdateNameParamsDto,
    @AuthUser() authUser: IAuthUser,
    @AuthToken() authToken: string
  ) {
    const permissions = await this.authService.getTenantPermissions(authUser.roles, authToken)
    const hasPermission = RBACCheckTenantResourceAction(
      permissions,
      PLATFORM_TENANT_ID,
      RESOURCE_TYPE.CLUSTER,
      RESOURCE_ACTION.Edit
    )
    if (!hasPermission) {
      throw new ForbiddenException('you do not have permission to do this operations')
    }
    return this.openapiService.updateClusterFlavors(body, param.clusterName, authToken)
  }
}
