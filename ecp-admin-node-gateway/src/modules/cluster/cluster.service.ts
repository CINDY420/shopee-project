import { Injectable } from '@nestjs/common'
import {
  AddClusterBody,
  ListClustersQuery,
  ListClustersResponse,
  GetClusterDetailResponse,
  ListClusterMetasQuery,
  EnableKarmadaBody,
  AddToEKSClusterBody,
} from '@/modules/cluster/dto/cluster.dto'
import { EcpApisService } from '@/shared/ecp-apis/ecp-apis.service'
import {
  convertEcpApiQueryPagination,
  convertEcpApiFilterBy,
  convertEcpApiOrderBy,
} from '@/helpers/query/ecp-apis'
import { EnumType, clusterListSupportedOrderByMap } from '@/constants/ecpApis'
import { GlobalService } from '@/modules/global/global.service'
import { IV2AddClusterMetaRequest } from 'src/backend-services/ecp-apis/services/open.dto'
import { EcpAdminApisService } from '@/shared/ecp-admin-apis/ecp-admin-apis.service'
import { EksApisService } from '@/shared/eks-apis/eks-apis.service'
import { IClusterAddClusterReq } from '@/backend-services/eks-apis/services/open.dto'

@Injectable()
export class ClusterService {
  constructor(
    private readonly ecpApisService: EcpApisService,
    private readonly ecpAdminApisService: EcpAdminApisService,
    private readonly eksApisService: EksApisService,
    private readonly globalService: GlobalService,
  ) {}

  addCluster(body: AddClusterBody) {
    const { clusterId, azV1, monitoringUrl, ecpVersion, useOam, useQuota } = body
    const parsedBody: IV2AddClusterMetaRequest = {
      uuid: clusterId,
      azV1,
      monitoringUrl,
      ecpVersion,
      useOam,
      useQuota,
    }
    return this.ecpApisService.getApis().addClusterMeta(parsedBody)
  }

  async listClusters(query: ListClustersQuery): Promise<ListClustersResponse> {
    const { offset, limit, filterBy, orderBy, searchBy } = query
    const ecpApiPagination = convertEcpApiQueryPagination(offset, limit)
    const equalFilters = ListClustersQuery.parseEqualFilters(filterBy)
    const parsedOrderBy = ListClustersQuery.parseOrderBy(orderBy)
    const orderKey = parsedOrderBy?.key || orderBy
    const orderValue = parsedOrderBy?.order
    const {
      clusterType = [],
      azv1Key = [],
      azv2Key = [],
      segmentName = [],
      status = [],
      healthyStatus: health = [],
    } = equalFilters

    const allSegments = await this.globalService.listAllSegmentNames()
    const filteredSegmentKeys: string[] = []
    const filteredSegments = allSegments.items.filter(({ name }) => segmentName.includes(name))
    filteredSegments.forEach(({ segmentKeys }) => {
      filteredSegmentKeys.push(...segmentKeys)
    })
    const deduplicatedSegmentKeys = Array.from(new Set(filteredSegmentKeys))

    const ecpApiFilterBy = convertEcpApiFilterBy({
      cluster_type: clusterType,
      az_v1: azv1Key,
      az_v2: azv2Key,
      segment_key: deduplicatedSegmentKeys,
      status,
      health,
    })
    const supportOrderKey = orderKey && clusterListSupportedOrderByMap[orderKey]
    const ecpApiOrderBy =
      supportOrderKey && orderValue
        ? convertEcpApiOrderBy(supportOrderKey, orderValue)
        : supportOrderKey

    const clustersResponse = await this.ecpApisService.getApis().listClusterDetail({
      ...ecpApiPagination,
      filterBy: ecpApiFilterBy,
      orderBy: ecpApiOrderBy,
      searchBy,
    })
    const { total = 0, items = [] } = clustersResponse
    const parsedItems: ListClustersResponse['items'] = items.map((clusterDetail) => {
      const { meta, status } = clusterDetail || {}
      const {
        displayName = '',
        uuid = '',
        clusterType = '',
        azV1 = '',
        azV2 = '',
        segmentKey = '',
        labels = [],
        createTs = '',
        karmadaClusterUuid = '',
      } = meta || {}
      const {
        podSummary,
        nodeSummary,
        metrics,
        status: clusterStatus = '',
        health = '',
        observabilityLink = '',
        healthGalioMsg = '',
        healthKamardaMsg = '',
      } = status || {}
      const targetSegment = allSegments.items.find(({ segmentKeys }) =>
        segmentKeys.includes(segmentKey),
      )
      return {
        displayName,
        clusterId: uuid,
        clusterType,
        azv1Key: azV1,
        azv2Key: azV2,
        segmentKey,
        segmentName: targetSegment?.name,
        labels,
        metrics: {
          cpu: {
            used: metrics?.cpu?.used,
            applied: metrics?.cpu?.assigned,
            total: metrics?.cpu?.workerAllocatable,
          },
          memory: {
            used: metrics?.memory?.used,
            applied: metrics?.memory?.assigned,
            total: metrics?.memory?.workerAllocatable,
          },
        },
        nodeCount: nodeSummary?.count || 0,
        podCount: podSummary?.count || 0,
        status: clusterStatus,
        healthyStatus: health,
        healthGalioMsg,
        healthKamardaMsg,
        createTime: createTs,
        observabilityLink,
        karmadaCluster: !!karmadaClusterUuid,
      }
    })
    const allEnumsResponse = await this.ecpApisService.getApis().queryECPEnumerations()
    const { allenums: allEnums = [] } = allEnumsResponse
    const typeEnums = allEnums.find((enumsItem) => enumsItem.type === EnumType.CLUSTER_TYPE)
    const statusEnums = allEnums.find((enumsItem) => enumsItem.type === EnumType.CLUSTER_STATUS)
    const healthyStatusEnums = allEnums.find(
      (enumsItem) => enumsItem.type === EnumType.CLUSTER_HEALTH_STATUS,
    )

    return {
      totalCount: total,
      items: parsedItems,
      filterOptions: {
        type: typeEnums?.enums || [],
        status: statusEnums?.enums || [],
        healthyStatus: healthyStatusEnums?.enums || [],
      },
    }
  }

  async getClusterDetail(clusterId: string): Promise<GetClusterDetailResponse> {
    const clusterDetailResponse = await this.ecpApisService.getApis().queryClusterDetail(
      {
        uuid: clusterId,
      },
      { needStatus: true },
    )
    const { meta, status } = clusterDetailResponse?.detail || {}
    const {
      displayName = '',
      uuid = '',
      clusterType = '',
      azV1 = '',
      azV2 = '',
      segmentKey = '',
      labels = [],
      createTs = '',
      karmadaClusterUuid,
    } = meta || {}
    const {
      podSummary,
      nodeSummary,
      status: clusterStatus = '',
      health = '',
      observabilityLink = '',
      healthGalioMsg = '',
      healthKamardaMsg = '',
    } = status || {}

    return {
      displayName,
      clusterId: uuid,
      clusterType,
      azv1Key: azV1,
      azv2Key: azV2,
      segmentKey,
      labels,
      nodeCount: nodeSummary?.count || 0,
      podCount: podSummary?.count || 0,
      status: clusterStatus,
      healthyStatus: health,
      healthGalioMsg,
      healthKamardaMsg,
      createTime: createTs,
      observabilityLink,
      karmadaCluster: !!karmadaClusterUuid,
    }
  }

  async listClusterMetas(query: ListClusterMetasQuery) {
    const result = await this.ecpApisService.getFetch()['GET/ecpapi/v2/clustermetas']({
      pageSize: Number(query.pageSize),
      pageNum: Number(query.pageNum),
      filterBy: query.filterBy,
    })
    return {
      total: result.total ?? 0,
      items: result.items ?? [],
    }
  }

  async enableKarmada(clusterId: string, karmadaConfigs: EnableKarmadaBody) {
    return await this.ecpAdminApisService
      .getApis()
      .bindCluster({ srcUuid: clusterId, leapConfig: karmadaConfigs })
  }

  async addToEKSCluster(body: AddToEKSClusterBody) {
    const {
      azv2,
      azv2Key,
      description,
      etcdConfig,
      kubeConfig,
      labels,
      segment,
      segmentKey,
      serviceName,
      serviceId,
      env,
      deployedGalio,
      monitoringName,
      uuid,
      displayName,
    } = body

    const parsedBody: IClusterAddClusterReq = {
      az: azv2,
      az_key: azv2Key,
      description,
      etcd_config: {
        ca: etcdConfig?.sslCA,
        cert: etcdConfig?.sslCertificate,
        key: etcdConfig?.sslKey,
        member: etcdConfig?.etcdIPs,
      },
      kubeconfig: kubeConfig,
      labels,
      segment,
      segment_key: segmentKey,
      space_node_id: serviceId,
      space_node_name: serviceName,
      env,
      galio_disable: !deployedGalio,
      monitoring_label_name: monitoringName,
      uuid,
      name: displayName,
    }
    const data = await this.eksApisService.getApis().addExistCluster(parsedBody)
    return data?.id
  }
}
