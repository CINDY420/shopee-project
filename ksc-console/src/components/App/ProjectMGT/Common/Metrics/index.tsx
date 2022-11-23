import * as React from 'react'
import QuotaOverview from 'components/App/ProjectMGT/Common/Metrics/QuotaOverview'
import { RadioChangeEvent } from 'infrad'
import { IClusterProps } from 'components/App/ProjectMGT/TenantDetail/Overview'
import {
  metricsControllerGetTenantMetrics,
  metricsControllerGetProjectMetrics,
} from 'swagger-api/apis/Metrics'
import { IGetTenantMetricsResponse as metricsResponse } from 'swagger-api/models'

interface IMetricsProps {
  tenantName: string
  projectName?: string
  clusterItems: IClusterProps[]
  envs: string[]
  isTenantOverview?: boolean
}

const Metrics: React.FC<IMetricsProps> = ({
  tenantName,
  projectName,
  clusterItems,
  envs,
  isTenantOverview,
}) => {
  const [selectedEnv, setSelectedEnv] = React.useState(envs[0])
  const [selectedClusterId, setSelectedClusterId] = React.useState(clusterItems[0].clusterId)
  const [selectedClusterName, setSelectedClusterName] = React.useState<string | undefined>(
    clusterItems[0].clusterName,
  )
  const [metrics, setMetrics] = React.useState<metricsResponse>()
  const [isLoading, setIsLoading] = React.useState(false)

  const getClusterName = (clusterId: string) => {
    const cluster = clusterItems.find((clusterItem) => clusterItem.clusterId === clusterId)
    return cluster?.clusterName
  }

  const handleEnvChange = (e: RadioChangeEvent) => {
    setSelectedEnv(e.target.value)
  }

  const handleClusterChange = (clusterId: string) => {
    setSelectedClusterId(clusterId)
    setSelectedClusterName(getClusterName(clusterId))
  }

  const getProjectMetrics = React.useCallback(async () => {
    if (selectedClusterName && tenantName && projectName) {
      setIsLoading(true)
      try {
        const result = await metricsControllerGetProjectMetrics({
          tenantName,
          projectName,
          env: selectedEnv,
          clusterName: selectedClusterName,
          clusterId: selectedClusterId,
        })
        setMetrics(result)
        setIsLoading(false)
      } catch (_error) {
        setIsLoading(false)
      }
    }
  }, [projectName, selectedClusterId, selectedClusterName, selectedEnv, tenantName])

  const getTenantMetrics = React.useCallback(async () => {
    if (selectedClusterName && tenantName) {
      setIsLoading(true)
      try {
        const result = await metricsControllerGetTenantMetrics({
          tenantName,
          env: selectedEnv,
          clusterName: selectedClusterName,
          clusterId: selectedClusterId,
        })
        setMetrics(result)
        setIsLoading(false)
      } catch (_error) {
        setIsLoading(false)
      }
    }
  }, [selectedClusterId, selectedClusterName, selectedEnv, tenantName])

  React.useEffect(() => {
    if (isTenantOverview) getTenantMetrics()
    else getProjectMetrics()
  }, [getProjectMetrics, getTenantMetrics, isTenantOverview])

  return (
    <QuotaOverview
      envs={envs}
      clusterItems={clusterItems}
      selectedEnv={selectedEnv}
      isLoading={isLoading}
      selectedClusterId={selectedClusterId}
      metrics={metrics}
      onEnvChange={handleEnvChange}
      onClusterChange={handleClusterChange}
    />
  )
}

export default Metrics
