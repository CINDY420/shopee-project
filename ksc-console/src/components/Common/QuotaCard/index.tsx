import * as React from 'react'
import {
  StyledCard,
  StyledTitle,
  StyledProgress,
  StyledCycle,
  StyledLabelWrapper,
  StyledLabelItem,
  StyledQuotaWrapper,
  StyledQuotaName,
  StyledQuotaValueWrapper,
  StyledQuotaValue,
  StyledQuotaUnit,
  StyledCenterWrapper,
  StyledTotal,
  StyledHead,
  StyledOthersValue,
} from 'components/Common/QuotaCard/style'
import { VerticalDivider, HorizontalDivider } from 'common-styles/divider'
import { TENANT_QUOTA_MAPS, IUsageTypeProps } from 'constants/tenantDetail'
import { Empty, Spin } from 'infrad'
import { IGetProjectMetricsResponse, IUsage } from 'swagger-api/models'

interface IQuotaCardProps {
  metrics?: IGetProjectMetricsResponse
  usageType: IUsageTypeProps
  isLoading: boolean
  isShowTotal?: boolean
}

const QuotaValueComponent = (unit, value = 0, isShowTotal = false) => (
  <StyledQuotaValueWrapper>
    {isShowTotal && <StyledTotal>Total</StyledTotal>}
    <StyledQuotaValue>{Number(value).toFixed(2)}</StyledQuotaValue>
    <HorizontalDivider size="4px" />
    <StyledQuotaUnit>{unit}</StyledQuotaUnit>
  </StyledQuotaValueWrapper>
)

const getUsage = (overviewData: IUsage) => {
  const usage = overviewData.total
    ? (Number(overviewData.usage) / Number(overviewData.total)) * 100
    : 0
  return `${usage.toFixed(2)}%`
}

const getPercent = (usage: number, total: number) => {
  const percent = isNaN(total) || total === 0 ? 1 : (usage / total) * 100
  return percent
}

const QuotaCard: React.FC<IQuotaCardProps> = ({ usageType, metrics, isLoading, isShowTotal }) => {
  const overviewData = metrics?.[usageType.type]
  const { quota, usage, assigned, total } = overviewData ?? {}
  const percent = getPercent(Number(assigned), Number(quota))
  const successPercent = getPercent(Number(usage), Number(quota))
  const isEmpty = quota === null && usage === null && assigned === null
  return (
    <Spin spinning={isLoading}>
      <StyledCard>
        <StyledHead>
          <StyledTitle>{usageType.title}</StyledTitle>
          {isShowTotal && QuotaValueComponent(usageType.unit, total, isShowTotal)}
        </StyledHead>

        {!isEmpty ? (
          <div>
            <VerticalDivider size="12px" />
            <StyledProgress
              percent={percent}
              showInfo={false}
              success={{ percent: successPercent }}
              trailColor={usageType.colors.quota}
              background={usageType.colors.assigned}
              successbackground={usageType.colors.usage}
            />
            <VerticalDivider size="24px" />
            <StyledLabelWrapper>
              {TENANT_QUOTA_MAPS.map((quota) => (
                <StyledLabelItem key={quota.quotaName}>
                  <StyledCycle background={usageType.colors[quota.key]} />
                  <HorizontalDivider size="8px" />
                  <StyledQuotaWrapper>
                    <StyledQuotaName>{quota.quotaName}</StyledQuotaName>
                    <VerticalDivider size="12px" />
                    {QuotaValueComponent(usageType.unit, overviewData?.[quota.key])}
                  </StyledQuotaWrapper>
                </StyledLabelItem>
              ))}
            </StyledLabelWrapper>
            <VerticalDivider size="14px" />
            {isShowTotal && (
              <StyledLabelWrapper>
                <StyledLabelItem>
                  <StyledOthersValue>
                    {overviewData && getUsage(overviewData)} Usage
                  </StyledOthersValue>
                </StyledLabelItem>
              </StyledLabelWrapper>
            )}
          </div>
        ) : (
          <StyledCenterWrapper>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </StyledCenterWrapper>
        )}
      </StyledCard>
    </Spin>
  )
}

export default QuotaCard
