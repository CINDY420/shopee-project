import * as React from 'react'
import { Typography, Spin, Empty } from 'infrad'

import { CenterWrapper } from 'common-styles/flexWrapper'
import { Card } from 'common-styles/cardWrapper'
import Count from './Count'

import { primary, info, grey } from 'constants/colors'
import { formatFloat } from 'helpers/format'

import { CountWrapper, Warning, SuccessProgress, NormalProgress, CardWrapper } from './style'

const { Title } = Typography

interface IQuotasCardParams {
  title: string
  usage: {
    alarm?: string // TODO: 等待接口添加
    assigned?: number
    capacity: number
    used: number
    Ready?: boolean // TODO: 等待接口添加
  }
  unit?: string
  hasTotal?: boolean
  isNoLimited?: boolean
  formatDataFn?: any
  hasApplied?: boolean
  usedState?: string
  appliedState?: string
  totalState?: string
}

const getPercent = (used: number, total: number) => parseFloat(((used / total) * 100).toFixed(1))

const QuotasCard = ({
  title,
  unit,
  usage,
  hasTotal,
  isNoLimited,
  formatDataFn,
  hasApplied = true,
  usedState = 'Used',
  appliedState = 'Applied',
  totalState = 'Total'
}: IQuotasCardParams) => {
  if (!usage) {
    return (
      <CardWrapper>
        <Card height='210px' padding='24px'>
          <Spin />
        </Card>
      </CardWrapper>
    )
  }

  const { alarm, assigned, capacity, used, Ready = true } = usage
  const formatData = formatDataFn || formatFloat

  const percent = hasTotal ? getPercent(assigned, capacity) : getPercent(used, assigned)
  const successPercent = hasTotal ? getPercent(used, capacity) : 0
  const usedAppliedPercentDesc = getPercent(used, assigned) + '%'

  return (
    <CardWrapper>
      <Card height='210px' padding='24px'>
        <Title level={4}>{title}</Title>
        {Ready ? (
          <>
            {isNoLimited ? (
              <NormalProgress percent={0} showInfo={false} />
            ) : hasTotal ? (
              <SuccessProgress percent={percent} successPercent={successPercent} showInfo={false} />
            ) : (
              <NormalProgress percent={percent} showInfo={false} />
            )}
            <CountWrapper>
              <Count
                color={primary}
                name={usedState}
                unit={unit}
                count={formatData(used)}
                desc={!isNoLimited && assigned ? usedAppliedPercentDesc : ''}
              />
              {!isNoLimited && hasApplied && (
                <Count
                  color={hasTotal ? info : grey}
                  name={appliedState}
                  unit={unit}
                  count={formatData(assigned)}
                  desc={`${formatData(assigned - used)} ${unit} unused`}
                />
              )}
              {hasTotal && <Count color={grey} name={totalState} unit={unit} count={formatData(capacity)} />}
              {isNoLimited && <Count color={grey} name={totalState} isNoLimited />}
            </CountWrapper>
            {alarm && <Warning type='warning' showIcon message={alarm} />}
          </>
        ) : (
          <CenterWrapper>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </CenterWrapper>
        )}
      </Card>
    </CardWrapper>
  )
}

export default QuotasCard
