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
} from 'components/App/ProjectMGT/JobDetail/JobTabs/Overview/style'
import { VerticalDivider, HorizontalDivider } from 'common-styles/divider'
import { useRecoilValue } from 'recoil'
import { selectedJob } from 'states'
import { STATUS_COLORS_MAP } from 'constants/projectDetail'

const STATUS = ['Running', 'Pending', 'Failed', 'Unknown', 'Succeeded']

const Overview = () => {
  const { podOverview } = useRecoilValue(selectedJob)
  const overviewData = Object.entries(podOverview).reduce(
    (result: Record<string, number>, overview: [string, number]) => {
      const total = podOverview.Total
      const [key, value] = overview
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
        {STATUS.map((item, index) => (
          <BarItem
            // eslint-disable-next-line react/no-array-index-key -- no other property to use
            key={index}
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

export default Overview
