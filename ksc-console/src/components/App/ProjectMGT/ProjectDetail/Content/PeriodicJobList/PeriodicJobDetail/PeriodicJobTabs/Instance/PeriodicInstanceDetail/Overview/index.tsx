import { VerticalDivider, HorizontalDivider } from 'common-styles/divider'
import { useRecoilValue } from 'recoil'
import { selectedPeriodicJobInstance } from 'states'
import { STATUS_COLORS_MAP } from 'constants/projectDetail'
import {
  OverviewWrapper,
  Title,
  BarWrapper,
  BarItem,
  LabelWrapper,
  LabelItem,
  Cycle,
  Status,
  QuotaWrapper,
  Quota,
  Unit,
} from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/PeriodicJobDetail/PeriodicJobTabs/Instance/PeriodicInstanceDetail/Overview/style'

const STATUS = ['Running', 'Pending', 'Failed', 'Unknown', 'Succeeded']

const InstanceOverview = () => {
  const { podOverview } = useRecoilValue(selectedPeriodicJobInstance)
  const overviewData = Object.entries(podOverview).reduce(
    (result: Record<string, number>, [key, value]: [string, number]) => {
      const total = podOverview.Total
      result[key] = total ? Number(((value / total) * 100).toFixed(2)) : 0
      return result
    },
    {},
  )

  return (
    <OverviewWrapper>
      <Title>Pod Status</Title>
      <VerticalDivider size="12px" />
      <BarWrapper>
        {STATUS.map((item) => (
          <BarItem
            key={item}
            width={`${overviewData[item]}%`}
            backgroundColor={STATUS_COLORS_MAP[item].color}
          />
        ))}
      </BarWrapper>
      <VerticalDivider size="24px" />
      <LabelWrapper>
        {STATUS.map((item) => (
          <LabelItem key={item} backgroundColor={STATUS_COLORS_MAP[item].color}>
            <Cycle key={item} background={STATUS_COLORS_MAP[item].color} />
            <HorizontalDivider size="8px" />
            <Status>{item}</Status>
            <HorizontalDivider size="8px" />
            <QuotaWrapper>
              <Quota>{overviewData[item]}</Quota>
              <HorizontalDivider size="4px" />
              <Unit>%</Unit>
            </QuotaWrapper>
          </LabelItem>
        ))}
      </LabelWrapper>
    </OverviewWrapper>
  )
}

export default InstanceOverview
