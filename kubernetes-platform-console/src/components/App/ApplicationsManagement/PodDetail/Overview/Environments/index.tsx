import * as React from 'react'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'

import { Table } from 'common-styles/table'
import { IPod } from 'api/types/application/pod'
import { ColumnsType } from 'infrad/lib/table'

import { Header, Title } from './style'
import { Select, Tooltip } from 'infrad'
import { podsControllerGetPodContainerEnvs } from 'swagger-api/v3/apis/Pods'
interface EnvironmentsProps {
  pod: IPod
}

const columns: ColumnsType = [
  {
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'Value',
    dataIndex: 'value',
    ellipsis: true,
    render: (value: string) => {
      return (
        <Tooltip
          placement='topLeft'
          title={value}
          getPopupContainer={() => document.body}
          overlayStyle={{ maxWidth: '700px' }}
        >
          <span>{value}</span>
        </Tooltip>
      )
    }
  }
]

const Environments: React.FC<EnvironmentsProps> = ({ pod }) => {
  const { containers } = pod
  const [selectedContainer, setSelectedContainer] = React.useState<string | undefined>(
    containers.length ? containers[0] : undefined
  )
  const [getPodContainerEnvironmentsState, getPodContainerEnvironmentsFn] = useAsyncIntervalFn(
    podsControllerGetPodContainerEnvs
  )

  React.useEffect(() => {
    if (selectedContainer) {
      getPodContainerEnvironmentsFn({
        tenantId: pod.tenantId,
        projectName: pod.projectName,
        appName: pod.appName,
        clusterId: pod.clusterId,
        containerName: selectedContainer,
        podName: pod.name
      })
    }
  }, [selectedContainer, pod, getPodContainerEnvironmentsFn])
  const { pairs: environmentPairs } = getPodContainerEnvironmentsState.value || {}
  const environments = Object.entries(environmentPairs || []).map(([name, value]) => ({
    name,
    value
  }))

  return (
    <>
      <Header>
        <Title>Environments</Title>
        <Select
          onSelect={value => setSelectedContainer(value)}
          value={selectedContainer}
          options={containers.map(container => ({
            title: `Container: ${container}`,
            value: container
          }))}
        />
      </Header>
      <Table
        loading={getPodContainerEnvironmentsState.loading}
        rowKey='name'
        columns={columns}
        dataSource={environments}
        pagination={false}
      />
    </>
  )
}

export default Environments
