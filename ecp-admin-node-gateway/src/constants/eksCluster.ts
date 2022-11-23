export const clusterListFilterMap: Record<string, string> = {
  serviceName: 'space_node_name',
  healthyStatus: 'health_status',
  status: 'status',
  az: 'az',
  segment: 'segment',
}

export const clusterListOrderbyMap: Record<string, string> = {
  nodeCount: 'node_count',
  createdTime: 'created_at',
}

export const clusterListOrderKeyMap: Record<string, string> = {
  ascend: 'asc',
  descend: 'desc',
}
