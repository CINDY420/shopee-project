import { Injectable } from '@nestjs/common'
import { EksApisService } from '@/shared/eks-apis/eks-apis.service'
import {
  EksListAllAzSegmentResponse,
  EksListAllEnvsResponse,
  EksListAllTemplatesResponse,
  EksListAllSpaceTenantsResponse,
  EksListAllSpaceTenantProductsResponse,
  EksListAllPlatformsResponse,
  EksListAllKubernetesVersionsResponse,
  EksListAllVpcsResponse,
  EksGetTemplateDetailResponse,
} from '@/modules/eks-enums/dto/eks-enums.dto'

@Injectable()
export class EksEnumsService {
  constructor(private readonly eksApiService: EksApisService) {}

  async listAllAzSegment(): Promise<EksListAllAzSegmentResponse> {
    const azResponse = await this.eksApiService.getApis().listAZs()
    const formattedAzs = azResponse?.az_list?.map(
      ({ az_key: azKey = '', az_name: azName = '', segments = [] }) => {
        const formattedSegments = segments?.map(
          ({ segment_key: segmentKey = '', segment_name: segmentName = '' }) => ({
            segmentKey,
            segmentName,
          }),
        )
        return { azKey, azName, segments: formattedSegments || [] }
      },
    )
    return { items: formattedAzs || [] }
  }

  async listAllEnvs(): Promise<EksListAllEnvsResponse> {
    const envResponse = await this.eksApiService.getApis().listEnv()
    return { items: envResponse.env_list || [] }
  }

  async listAllTemplates(): Promise<EksListAllTemplatesResponse> {
    const templatesResponse = await this.eksApiService.getApis().listClusterTemplate({})
    const formattedTemplates = templatesResponse.items?.map(({ id = 0, name = '' }) => ({
      id,
      name,
    }))
    return { items: formattedTemplates || [] }
  }

  async getTemplateDetail(id: number): Promise<EksGetTemplateDetailResponse> {
    const clusterTemplateDetailResponse = await this.eksApiService
      .getApis()
      .getClusterTemplate({ id })
    const clusterConfig = clusterTemplateDetailResponse?.cluster_template?.cluster_config
    const {
      addon_config: addonConfig,
      control_plane_args: controlPlaneArgs,
      etcd_config: etcdConfig,
      event_etcd_config: eventEtcdConfig,
      network_config: networkConfig,
      version,
    } = clusterConfig || {}
    const template: EksGetTemplateDetailResponse = {
      advance: {
        apiServerExtraArgs: controlPlaneArgs?.api_server_extra_args,
        controllerManagementExtraArgs: controlPlaneArgs?.controller_extra_args,
        schedulerExtraArgs: controlPlaneArgs?.scheduler_extra_args,
        eventEtcd: {
          IPs: eventEtcdConfig?.member || [],
          authority: eventEtcdConfig?.ca || '',
          certification: eventEtcdConfig?.cert || '',
          key: eventEtcdConfig?.key || '',
        },
        enableLog: addonConfig?.enable_log,
        enableMonitoring: addonConfig?.enable_monitor,
        enableBromo: addonConfig?.enable_bromo,
      },
      networkingModel: {
        enableVpcCNI: networkConfig?.sdn_enable || true,
        vpc: networkConfig?.sdn_config?.vpc_id || '',
        anchorServer: networkConfig?.sdn_config?.anchor_server || '',
      },
      clusterNetwork: { servicesCidrBlocks: networkConfig?.services_cidr || '' },
      etcd: {
        IPs: etcdConfig?.member || [],
        authority: etcdConfig?.ca || '',
        certification: etcdConfig?.cert || '',
        key: etcdConfig?.key || '',
      },
      clusterSpec: {
        clusterName: '',
        kubernetesVersion: version || '',
      },
    }
    return template
  }

  async listAllSpaceTenants(): Promise<EksListAllSpaceTenantsResponse> {
    const tenantsResponse = await this.eksApiService.getApis().listTenants()
    return { items: tenantsResponse?.tenants || [] }
  }

  async listAllSpaceTenantProducts(
    tenantName: string,
  ): Promise<EksListAllSpaceTenantProductsResponse> {
    const productsResponse = await this.eksApiService.getApis().listProducts({ tenantName })
    const formattedProducts = productsResponse?.products?.map(
      ({ space_node_id: productId = 0, space_node_name: productName = '' }) => ({
        productId,
        productName,
      }),
    )
    return { items: formattedProducts || [] }
  }

  async listAllPlatforms(): Promise<EksListAllPlatformsResponse> {
    const platformsResponse = await this.eksApiService.getApis().listPlatforms()
    return {
      items:
        platformsResponse?.platforms?.map(({ id = -1, platform_name: name = '' }) => ({
          id,
          name,
        })) || [],
    }
  }

  async listAllKubernetesVersions(): Promise<EksListAllKubernetesVersionsResponse> {
    const kubernetesVersionsResponse = await this.eksApiService.getApis().getK8sInCluster()
    return { items: kubernetesVersionsResponse?.versions || [] }
  }

  async listAllVpcs(platformID: number, az: string): Promise<EksListAllVpcsResponse> {
    const vpcsResponse = await this.eksApiService.getApis().listVPC({ platformID, az })
    const formattedVpcs = vpcsResponse.vpcs?.map(
      ({ name = '', is_default: isDefault = false }) => ({ name, isDefault }),
    )
    return { items: formattedVpcs || [] }
  }
}
