import * as React from 'react'
import { Select } from 'infrad'

import QuotasCard from '../QuotasCard'
import { RadiosTabs, RadiosTabPane } from 'components/Common/RadiosTabs'
import { HorizontalDivider, VerticalDivider } from 'common-styles/divider'
import { RowWrapper } from 'common-styles/flexWrapper'

import { formatDataFromByteToGib } from 'helpers/format'
import { StyledSelect, SelectWrapper } from './style'

interface IQuotasViewProps {
  quota: any
  isCollapse?: boolean
  envs: string[]
  clusters: string[]
  onEnvChange: (activeValue: string) => void
  onClusterChange: (activeValue: string) => void
  selectedCluster: string
  selectedEnv: string
}

const QuotasView: React.FC<IQuotasViewProps> = ({
  quota = {},
  envs = [],
  clusters = [],
  isCollapse = false,
  onEnvChange,
  onClusterChange,
  selectedCluster,
  selectedEnv
}) => {
  return (
    <>
      <RowWrapper padding='0' alignItems='baseline' style={isCollapse ? { paddingLeft: '52px' } : {}}>
        <div>
          <RadiosTabs activeKey={selectedEnv} onChange={onEnvChange}>
            {envs.map(env => (
              <RadiosTabPane key={env} name={env} value={env}></RadiosTabPane>
            ))}
          </RadiosTabs>
        </div>
        <SelectWrapper>
          <span>Cluster</span>
          <StyledSelect value={selectedCluster} onChange={onClusterChange}>
            {clusters.map((item: string) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </StyledSelect>
        </SelectWrapper>
      </RowWrapper>
      <VerticalDivider size='24px' />
      <RowWrapper padding='0'>
        <QuotasCard title='CPU Usage' unit='Cores' hasTotal usage={quota.cpu} />
        <HorizontalDivider size='24px' />
        <QuotasCard
          title='Memory Usage'
          unit='GiB'
          hasTotal
          usage={quota.memory}
          formatDataFn={formatDataFromByteToGib}
        />
        <HorizontalDivider size='24px' />
        <QuotasCard
          title='File System Usage'
          unit='GiB'
          isNoLimited
          usage={quota.filesystem}
          formatDataFn={formatDataFromByteToGib}
        />
      </RowWrapper>
    </>
  )
}

export default QuotasView
