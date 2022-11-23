import { Injectable } from '@nestjs/common'
import {
  EksListClustersQuery,
  EksGetClusterDetailParams,
  EKSCreateClusterBody,
  GetClusterSummaryParams,
  GetAnchorServerResponse,
  EKSCreateClusterResponse,
} from '@/modules/eks-cluster/dto/eks-cluster.dto'
import { EksApisService } from '@/shared/eks-apis/eks-apis.service'
import { throwError } from '@infra-node-kit/exception'
import { EKS_CLUSTER_APIS_ERROR } from '@/constants/error'
import { listQuery, tryCatch } from '@infra/utils'
import {
  clusterListFilterMap,
  clusterListOrderbyMap,
  clusterListOrderKeyMap,
} from '@/constants/eksCluster'
import { IClusterCreateClusterReq } from '@/backend-services/eks-apis/services/open.dto'

const { FilterByParser, FilterByOperator, parseOrderBy, offsetLimitToPagination } = listQuery

@Injectable()
export class EksClusterService {
  constructor(private readonly eksApisService: EksApisService) {}

  private buildClusterListFilters = (filterBy: string | undefined): string | undefined => {
    if (filterBy === undefined) {
      return undefined
    }

    const filterByParser = new FilterByParser(filterBy)

    const equalKeyPathValuesMap = filterByParser.parseByOperator(FilterByOperator.EQUAL)

    const labelSelector = Object.entries(equalKeyPathValuesMap)
      .map(([key, values]) => `${clusterListFilterMap[key]}==${values.join(',')}`)
      .join(';')

    return labelSelector
  }

  private buildClusterListOrderBy = (orderByString: string | undefined): string | undefined => {
    if (orderByString === undefined) {
      return undefined
    }
    const parsedOrderBy = parseOrderBy(orderByString)
    const orderBy =
      parsedOrderBy &&
      `${clusterListOrderbyMap[parsedOrderBy.keyPath]}==${
        parsedOrderBy?.order && clusterListOrderKeyMap[parsedOrderBy.order]
      }`
    return orderBy
  }

  async listClusters(query: EksListClustersQuery) {
    const { offset, limit, orderBy: orderByString, filterBy, searchBy } = query

    const orderBy = this.buildClusterListOrderBy(orderByString)

    const fieldSelector = this.buildClusterListFilters(filterBy)

    const { currentPage, pageSize } = offsetLimitToPagination({
      offset: Number(offset),
      limit: Number(limit),
    })

    const { items = [], all_count: total = 0 } = await this.eksApisService.getApis().listCluster({
      pageNo: currentPage,
      pageSize,
      orderBy,
      fieldSelector,
      fuzzySearch: searchBy,
    })

    const parsedItems = items?.map((item) => {
      const {
        az = '',
        created_at: createdTime = '',
        env = '',
        healthy_status: healthyStatus = '',
        name = '',
        node_count: nodeCount = 0,
        space_node_id: nodeId = 0,
        space_node_name: serviceName = '',
        observability_link: observabilityLink = '',
        uuid = '',
        segment = '',
        status = '',
        id = 0,
      } = item
      return {
        az,
        createdTime,
        env,
        healthyStatus,
        displayName: name,
        nodeCount,
        nodeId,
        serviceName,
        observabilityLink,
        segment,
        status,
        uuid,
        id,
      }
    })

    const {
      az: azList = [],
      healthy_status: healthyStatusList = [],
      segment: segmentList = [],
      space_node_name: servicesNameList = [],
      status: statusList = [],
    } = await this.eksApisService.getApis().getSelectorInCluster()

    return {
      items: parsedItems,
      total,
      azList,
      healthyStatusList,
      servicesNameList,
      statusList,
      segmentList,
    }
  }

  async getClusterDetail(params: EksGetClusterDetailParams) {
    const { clusterId } = params
    const { cluster } = await this.eksApisService.getApis().getCluster({
      id: clusterId,
    })
    const {
      cluster_runtime_info: clusterRuntimeInfo = {},
      name: clusterName = '',
      az = '',
      segment = '',
      created_at: createTime = '',
      kube_config: kubeConfig = '',
      platform_name: platformName = '',
      env = '',
    } = cluster || {}
    const {
      healthy_status: healthyStatus = '',
      status = '',
      node_count: nodeCount = 0,
    } = clusterRuntimeInfo
    return {
      healthyStatus,
      clusterName,
      status,
      AZv2: az,
      segment,
      createTime,
      kubeConfig,
      platformName,
      env,
      nodeCount,
    }
  }

  async createEKSCluster(body: EKSCreateClusterBody): Promise<EKSCreateClusterResponse> {
    const {
      resourceInfo,
      clusterSpec,
      advance,
      etcd,
      networkingModel,
      clusterNetwork,
      serverList,
    } = body
    const {
      azName,
      azKey,
      segmentName,
      segmentKey,
      templateId,
      service = [],
      env,
    } = resourceInfo || {}
    const [tenantName, productValue] = service
    // productValue is 'productName===productId'
    const { productName, productId = '' } = this.parseProductValue(productValue)
    const spaceNodeName = productName ? `${tenantName}.${productName}` : tenantName

    const { masterIPs, workIPs = [] } = serverList || {}
    const {
      enableBromo,
      enableLog,
      enableMonitoring,
      enableDragonfly,
      enableGPU,
      apiServerExtraArgs,
      controllerManagementExtraArgs,
      schedulerExtraArgs,
      eventEtcd,
    } = advance || {}
    const { authority, certification, key, IPs } = etcd || {}
    const {
      authority: eventAuthority,
      certification: eventCertification,
      key: eventKey,
      IPs: eventIPs,
    } = eventEtcd || {}
    const { anchorServer, enableVpcCNI, vpc } = networkingModel || {}
    const { kubernetesVersion, clusterName, platformName, platformId } = clusterSpec || {}
    const { servicesCidrBlocks, podCidrBlocks, nodeMask } = clusterNetwork || {}

    const formattedBody: IClusterCreateClusterReq = {
      az: azName,
      az_key: azKey,
      cluster_config: {
        addon_config: {
          enable_bromo: enableBromo,
          enable_log: enableLog,
          enable_monitor: enableMonitoring,
        },
        control_plane_args: {
          api_server_extra_args: apiServerExtraArgs,
          controller_extra_args: controllerManagementExtraArgs,
          scheduler_extra_args: schedulerExtraArgs,
        },
        etcd_config: {
          ca: authority,
          cert: certification,
          etcd_type: undefined,
          etcd_uuid: undefined,
          key,
          member: IPs,
        },
        event_etcd_config: {
          ca: eventAuthority,
          cert: eventCertification,
          etcd_type: undefined,
          etcd_uuid: undefined,
          key: eventKey,
          member: eventIPs,
        },
        event_separate: !!eventIPs,
        network_config: {
          node_mask_size: nodeMask,
          pod_cidr: podCidrBlocks,
          sdn_enable: enableVpcCNI,
          sdn_config: {
            anchor_server: anchorServer,
            vpc_id: vpc,
          },
          services_cidr: servicesCidrBlocks,
        },
        version: kubernetesVersion,
      },
      cluster_name: clusterName,
      env,
      master_list: masterIPs,
      platform_name: platformName,
      platform_id: platformId,
      segment: segmentName,
      segment_key: segmentKey,
      space_node_id: Number(productId),
      space_node_name: spaceNodeName,
      template_id: templateId,
      worker_config: {
        features: {
          dragonfly: enableDragonfly,
          gpu: enableGPU,
          register_dns: undefined,
          register_zk: undefined,
        },
        kubelet_extra_args: undefined,
        kubelet_version: kubernetesVersion,
      },
      worker_list: workIPs,
      worker_template_id: undefined,
    }
    const [response, error] = await tryCatch(
      this.eksApisService.getApis().postCluster(formattedBody),
    )

    if (!error) {
      const { id = -1, provision_job_id: provisionJobId = -1 } = response
      return { id, provisionJobId }
    }
    throwError({ ...EKS_CLUSTER_APIS_ERROR.CREATE_CLUSTER_FAILED, message: error.message })
  }

  private parseProductValue(value: string) {
    if (typeof value !== 'string') return {}
    const [productName, productId] = value.split('===')
    return { productName, productId }
  }

  async getClusterSummary(params: GetClusterSummaryParams) {
    const { clusterId } = params
    const { pod_count: podCount = 0, summary = {} } = await this.eksApisService
      .getApis()
      .getClusterSummary({
        id: clusterId,
      })
    const {
      total: totalCount = 0,
      not_ready_count: notReadyCount = 0,
      ready_count: readyCount = 0,
      unknown_count: unknownCount = 0,
    } = summary

    return {
      totalCount,
      notReadyCount,
      podCount,
      readyCount,
      unknownCount,
    }
  }

  async getAnchorServer(env: string, az: string): Promise<GetAnchorServerResponse> {
    const anchorServerResponse = await this.eksApisService.getApis().getAnchorServer({ env, az })
    return { address: anchorServerResponse.address || '' }
  }

  async getClusterInfoByUuid(uuid: string) {
    const clusterInfo = await this.eksApisService.getApis().getClusterByUUIDSummary({ uuid })
    const {
      cluster_runtime_info: clusterRuntimeInfo = {},
      name: clusterName = '',
      az = '',
      segment = '',
      created_at: createTime = '',
      kube_config: kubeConfig = '',
      id = -1,
    } = clusterInfo?.cluster ?? {}
    const { healthy_status: healthyStatus = '', status = '' } = clusterRuntimeInfo
    return {
      healthyStatus,
      clusterName,
      status,
      AZv2: az,
      segment,
      createTime,
      kubeConfig,
      id,
    }
  }
}
