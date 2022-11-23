/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import { Spin, Empty, Result } from 'infrad'

import { useRecoilValue } from 'recoil'
import { selectedTenant } from 'states/applicationState/tenant'

import QuotasOverview from 'components/App/ApplicationsManagement/Common/QuotasOverview'

import { groupsControllerGetGroupMetrics } from 'swagger-api/v3/apis/Tenants'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'

const { useEffect, useState } = React

const Metrics: React.FC = () => {
  const tenantDetail = useRecoilValue(selectedTenant)
  const { id: tenantId, envClusterMap, envs = [] } = tenantDetail || {}

  const [getGroupMetricsState, getGroupMetricsFn] = useAsyncIntervalFn(groupsControllerGetGroupMetrics, {
    enableIntervalCallback: true
  })
  const [selectedEnv, setSelectedEnv] = useState(envs[0])

  const [clusters, setClusters] = useState(envClusterMap[selectedEnv])
  const [selectedCluster, setSelectedCluster] = useState(clusters ? clusters[0] : '')

  const getMetrics = (env: string, cluster: string) => {
    if (!env || !cluster) {
      return
    }

    getGroupMetricsFn({ tenantId, env, cluster })
  }

  useEffect(() => {
    getMetrics(selectedEnv, selectedCluster)
  }, [])

  const handleEnvChange = (env: string) => {
    setSelectedEnv(env)

    let cluster = selectedCluster
    const clusters = envClusterMap[env] || []
    setClusters(clusters)

    if (!clusters.includes(selectedCluster)) {
      cluster = clusters[0]
      setSelectedCluster(cluster)
    }

    getMetrics(env, cluster)
  }

  const handleClusterChange = (cluster: string) => {
    setSelectedCluster(cluster)
    getMetrics(selectedEnv, cluster)
  }

  const { loading, value, error } = getGroupMetricsState
  const { quota } = value || {}

  return (
    <div>
      {selectedCluster && selectedEnv ? (
        <Spin spinning={loading}>
          {!error ? (
            <QuotasOverview
              isCollapse={true}
              quota={quota}
              clusters={clusters}
              envs={envs}
              selectedCluster={selectedCluster}
              selectedEnv={selectedEnv}
              onEnvChange={handleEnvChange}
              onClusterChange={handleClusterChange}
            />
          ) : (
            <Result status='error' title={error.code} subTitle={error.message} />
          )}
        </Spin>
      ) : (
        <Empty />
      )}
    </div>
  )
}

export default Metrics
