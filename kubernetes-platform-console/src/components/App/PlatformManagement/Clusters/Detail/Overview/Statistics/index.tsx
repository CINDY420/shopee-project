import * as React from 'react'
import { useRecoilValue } from 'recoil'

import { selectedCluster } from 'states/clusterState'
import { formatDataFromByteToGib } from 'helpers/format'
import { RowWrapper } from 'common-styles/flexWrapper'
import { VerticalDivider, HorizontalDivider } from 'common-styles/divider'
import { clustersControllerGetClusterInfo } from 'swagger-api/v3/apis/Cluster'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { ErrorTip } from 'common-styles/tipWrapper'

import QuotasCard from 'components/App/PlatformManagement/Clusters/Common/QuotasCard'
import { IAlarm } from 'api/types/cluster/cluster'

const Statistics: React.FC<Record<'isDeleting', boolean>> = ({ isDeleting }) => {
  const currentSelectedCluster = useRecoilValue(selectedCluster)

  const fetchFn = () => {
    return clustersControllerGetClusterInfo({ clusterName: currentSelectedCluster.name })
  }

  const [getClusterStatus, getClusterFn] = useAsyncIntervalFn(fetchFn, { enableIntervalCallback: !isDeleting })
  const {
    metrics = { cpu: { capacity: 0, used: 0 }, memory: { capacity: 0, used: 0 } },
    nodeSummary = { count: 0, unhealthyCount: 0 },
    alarms = []
  } = getClusterStatus.value || {}

  const nodeState = {
    capacity: nodeSummary.count,
    used: nodeSummary.count - nodeSummary.unhealthyCount
  }

  const getAlarmsInfo = () => (
    <>
      {alarms.length ? <VerticalDivider size='15px' /> : null}
      {alarms.map((item: IAlarm, index: number) => {
        return (
          <ErrorTip
            key={index}
            message={item.detail.title}
            description={item.detail.message || ' '}
            type='error'
            showIcon
          />
        )
      })}
    </>
  )

  React.useEffect(() => {
    getClusterFn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <RowWrapper padding='0px'>
        <QuotasCard title='CPU Usage' unit='Cores' hasTotal usage={metrics.cpu} />
        <HorizontalDivider size='15px' />
        <QuotasCard
          title='Memory Usage'
          unit='GiB'
          hasTotal
          usage={metrics.memory}
          formatDataFn={formatDataFromByteToGib}
        />
        <HorizontalDivider size='15px' />
        <QuotasCard title='Node' unit='' hasTotal hasApplied={false} usage={nodeState} usedState='Healthy' />
      </RowWrapper>
      {alarms ? getAlarmsInfo() : null}
    </div>
  )
}

export default Statistics
