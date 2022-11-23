/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import { Spin, Empty } from 'infrad'

import QuotasOverview from 'components/App/ApplicationsManagement/Common/QuotasOverview'
import { Card } from 'common-styles/cardWrapper'
import ChartCollapse from 'components/Common/ChartCollapse'

import { useRecoilValue } from 'recoil'
import { selectedProject } from 'states/applicationState/project'

import { projectsControllerGetProjectMetrics } from 'swagger-api/v3/apis/Projects'
import { IIGetMetricsResult } from 'swagger-api/v3/models'

const { useState } = React

const Overview: React.FC = () => {
  const project = useRecoilValue(selectedProject)
  const { tenantId, name: projectName, envClusterMap, envs = [] } = project || {}

  const [loading, setLoading] = React.useState(false)
  const [projectMetrics, setProjectMetrics] = React.useState<IIGetMetricsResult>()

  const [selectedEnv, setSelectedEnv] = useState(envs[0] || '')

  const clusters = envClusterMap[selectedEnv]?.value || []
  const [selectedCluster, setSelectedCluster] = useState(clusters[0] || '')

  const getProjectMetricsFn = React.useCallback(async (env: string, cluster: string) => {
    setLoading(true)
    try {
      const metrics = await projectsControllerGetProjectMetrics({ tenantId, projectName, env, cluster })
      setProjectMetrics(metrics)
    } catch (error) {
      // ignore error because bromo has no metrics
    }
    setLoading(false)
  }, [])

  const handleEnvChange = (env: string) => {
    setSelectedEnv(env)

    let cluster = selectedCluster
    const clusters = envClusterMap[env]
    if (!clusters.includes(selectedCluster)) {
      cluster = clusters[0] || ''
      setSelectedCluster(cluster)
    }

    getProjectMetricsFn(env, cluster)
  }

  const handleClusterChange = (cluster: string) => {
    setSelectedCluster(cluster)
    getProjectMetricsFn(selectedEnv, cluster)
  }

  const { quota } = projectMetrics || {}

  return (
    <Card padding='24px'>
      <Spin spinning={loading}>
        <ChartCollapse
          handleCollapseOpen={() => getProjectMetricsFn(selectedEnv, selectedCluster)}
          panel={
            selectedCluster ? (
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
              <Empty />
            )
          }
        />
      </Spin>
    </Card>
  )
}

export default Overview
