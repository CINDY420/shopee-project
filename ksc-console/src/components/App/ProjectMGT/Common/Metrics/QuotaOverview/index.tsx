import * as React from 'react'
import {
  FilterWrapper,
  SelectWrapper,
  StyledSelect,
  StyledRadioButton,
  QuotasWrapper,
} from 'components/App/ProjectMGT/Common/Metrics/QuotaOverview/style'
import ChartCollapse from 'components/Common/ChartCollapse'
import { Select, Radio, RadioChangeEvent } from 'infrad'
import { VerticalDivider } from 'common-styles/divider'
import QuotaCard from 'components/Common/QuotaCard'
import { IClusterProps } from 'components/App/ProjectMGT/TenantDetail/Overview'
import { USAGE_TYPES } from 'constants/tenantDetail'
import { IGetProjectMetricsResponse as metricsResponse } from 'swagger-api/models'

interface IQuotaOverviewProps {
  envs: string[]
  clusterItems: IClusterProps[]
  selectedEnv: string
  selectedClusterId: string
  isLoading: boolean
  metrics?: metricsResponse
  onEnvChange: (activeValue: RadioChangeEvent) => void
  onClusterChange: (activeValue: string) => void
}

const QuotaOverview: React.FC<IQuotaOverviewProps> = ({
  envs,
  clusterItems,
  selectedEnv,
  selectedClusterId,
  metrics,
  isLoading,
  onEnvChange: handleEnvChange,
  onClusterChange: handleClusterChange,
}) => (
  <ChartCollapse
    panel={
      <>
        <FilterWrapper padding="0" alignItems="baseline" style={{ paddingLeft: '52px' }}>
          <Radio.Group value={selectedEnv} size="middle" onChange={handleEnvChange}>
            {envs.map((env) => (
              <StyledRadioButton key={env} value={env}>
                {env}
              </StyledRadioButton>
            ))}
          </Radio.Group>
          <SelectWrapper>
            <span>Cluster</span>
            <StyledSelect
              defaultValue={selectedClusterId}
              value={selectedClusterId}
              onChange={handleClusterChange}
            >
              {clusterItems.map((clusterItem) => (
                <Select.Option key={clusterItem.clusterId} value={clusterItem.clusterId}>
                  {clusterItem.clusterName}
                </Select.Option>
              ))}
            </StyledSelect>
          </SelectWrapper>
        </FilterWrapper>
        <VerticalDivider size="24px" />
        <QuotasWrapper>
          {USAGE_TYPES.map((usageType) => (
            <QuotaCard
              key={usageType.title}
              metrics={metrics}
              usageType={usageType}
              isLoading={isLoading}
            />
          ))}
        </QuotasWrapper>
      </>
    }
  />
)

export default QuotaOverview
