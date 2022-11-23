// Supported by ecp v2 service
export enum EnumType {
  PLATFORM = 'platform',
  CLUSTER_TYPE = 'cluster_type',
  ECP_VERSION = 'ecp_version',
  KUBE_APISERVER_TYPE = 'kube_apiserver_type',
  AZ_PROPERTY = 'az_property',
  AZ_TYPE = 'az_type',
  CLUSTER_STATUS = 'cluster_status',
  CLUSTER_HEALTH_STATUS = 'cluster_health',
}

export const clusterListSupportedOrderByMap: Record<string, string> = {
  nodeCount: 'node_count',
  createTime: 'create_ts',
}
