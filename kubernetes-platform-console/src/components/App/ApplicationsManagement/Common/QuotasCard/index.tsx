import * as React from 'react'
import { Typography, Spin, Empty } from 'infrad'

import { CenterWrapper } from 'common-styles/flexWrapper'
import { Card } from 'common-styles/cardWrapper'
import Count from './Count'

import { primary, info, grey } from 'constants/colors'
import { formatFloat } from 'helpers/format'

import { CountWrapper, SuccessProgress, NormalProgress, CardWrapper } from './style'

const { Title } = Typography

interface IQuotasCardProps {
  title: string
  usage: {
    alarm?: string
    applied: number
    total: number
    used: number
    Ready: boolean
  }
  unit?: string
  hasTotal?: boolean
  isNoLimited?: boolean
  formatDataFn?: any
}

const getPercent = (used: number, total: number) => parseFloat(((used / total) * 100).toFixed(1))

const QuotasCard: React.FC<IQuotasCardProps> = ({ title, unit, usage, hasTotal, isNoLimited, formatDataFn }) => {
  if (!usage) {
    return (
      <CardWrapper>
        <Card overflow='hidden'>
          <Spin />
        </Card>
      </CardWrapper>
    )
  }

  const { applied, total, used, Ready } = usage
  const formatData = formatDataFn || formatFloat

  const percent = hasTotal ? (total ? getPercent(applied, total) : 100) : getPercent(used, applied)
  const successPercent = hasTotal ? (total ? getPercent(used, total) : getPercent(used, applied)) : 0
  // const usedAppliedPercentDesc = getPercent(used, applied) + '%'

  return (
    <CardWrapper>
      <Card overflow='hidden'>
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
                name='Used'
                unit={unit}
                count={formatData(used)}
                // desc={!isNoLimited && applied ? usedAppliedPercentDesc : ''}
              />
              {!isNoLimited && (
                <Count
                  color={hasTotal ? info : grey}
                  name='Applied'
                  unit={unit}
                  count={formatData(applied)}
                  // desc={`${formatData(applied - used)} ${unit} unused`}
                />
              )}
              {hasTotal &&
                (typeof total === 'number' ? (
                  <Count color={grey} name='Quota' unit={unit} count={formatData(total)} />
                ) : (
                  <Count color={grey} name='Quota' isNoLimited />
                ))}
              {isNoLimited && <Count color={grey} name='Quota' isNoLimited />}
            </CountWrapper>
            {/* {alarm && <Warning type='warning' showIcon message={alarm} />} */}
          </>
        ) : (
          <CenterWrapper>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '15px 0' }} />
          </CenterWrapper>
        )}
      </Card>
    </CardWrapper>
  )
}

export default QuotasCard
