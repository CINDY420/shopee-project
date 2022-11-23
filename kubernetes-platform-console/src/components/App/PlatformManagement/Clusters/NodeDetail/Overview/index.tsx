import * as React from 'react'

import { formatDataFromByteToGib } from 'helpers/format'
import { RowWrapper } from 'common-styles/flexWrapper'
import { HorizontalDivider } from 'common-styles/divider'
import { INode } from 'api/types/cluster/node'

import QuotasCard from 'components/App/PlatformManagement/Clusters/Common/QuotasCard'

interface IProps {
  node: INode
}

const Overview: React.FC<IProps> = ({ node }) => {
  const { memMetrics, cpuMetrics, podMetrics } = node
  return (
    <div data-cy='node-detail-overview'>
      <RowWrapper padding='0px'>
        <QuotasCard title='CPU Usage' unit='Cores' hasApplied={false} hasTotal usage={cpuMetrics} />
        <HorizontalDivider size='15px' />
        <QuotasCard
          title='Memory Usage'
          unit='GiB'
          hasApplied={false}
          hasTotal
          usage={memMetrics}
          formatDataFn={formatDataFromByteToGib}
        />
        <HorizontalDivider size='15px' />
        <QuotasCard title='Pod' unit='' hasTotal hasApplied={false} usage={podMetrics} usedState='Normal' />
      </RowWrapper>
    </div>
  )
}

export default Overview
