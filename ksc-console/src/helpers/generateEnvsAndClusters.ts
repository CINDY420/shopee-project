import { IEnvClusterMetric, IPayloadEnvQuota } from 'swagger-api/models'

function isEnvQuota(item: IEnvClusterMetric | IPayloadEnvQuota): item is IPayloadEnvQuota {
  return 'clusterQuota' in item
}

export default function generateEnvsAndClusters(
  envQuotas: Array<IEnvClusterMetric | IPayloadEnvQuota>,
) {
  const envs: Array<string> = []
  const clusters: Record<string, number> = {}
  envQuotas.forEach((item) => {
    envs.push(item.env)
    ;(isEnvQuota(item) ? item.clusterQuota : item?.clusterMetrics || []).forEach((cluster) => {
      if (!clusters[cluster.clusterName]) clusters[cluster.clusterName] = 1
    })
  })
  return [envs, Object.keys(clusters)]
}

export const generateClusters = (envQuotas: Array<IEnvClusterMetric | IPayloadEnvQuota>) => {
  const clusterIds: Record<string, string> = {}
  envQuotas.forEach((item) => {
    ;(isEnvQuota(item) ? item.clusterQuota : item?.clusterMetrics || []).forEach((cluster) => {
      if (!clusterIds[cluster.clusterId]) clusterIds[cluster.clusterId] = cluster.clusterName
    })
  })
  const clusters = Object.keys(clusterIds).map((item) => ({
    clusterId: item,
    clusterName: clusterIds[item],
  }))
  return clusters
}
