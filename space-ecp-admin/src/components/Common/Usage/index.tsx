import { ExclamationCircleOutlined } from 'infra-design-icons'
import React, { ReactNode } from 'react'
import {
  Statistics,
  Statistic,
  Cricle,
  Info,
  CountNumber,
  CountText,
  StyledTag,
  Header,
  Title,
  StyledCard,
  StyledProgress,
} from 'src/components/Common/Usage/style'
import type { Property } from 'csstype'
import { CSSProperties } from 'styled-components'

interface IUsageProps {
  header?: ReactNode
  title: string
  usedPercentage: number
  appliedPercentage: number
  used: number
  usedTitle?: string | ReactNode
  applied: number
  appliedTitle?: string | ReactNode
  total: number
  totalTitle?: string | ReactNode
  unit: 'Cores' | 'GiB'
  bordered?: boolean
  className?: string
  usedColor?: Property.Color
  appliedColor?: Property.Color
  totalColor?: Property.Color
  style?: CSSProperties
}

const Usage: React.FC<IUsageProps> = ({
  header,
  title,
  usedPercentage,
  appliedPercentage,
  used,
  usedTitle = 'Used',
  applied,
  appliedTitle = 'Applied',
  total,
  totalTitle = 'Total',
  unit,
  bordered,
  className,
  usedColor = '#4D94EB',
  appliedColor = '#A6D4FF',
  totalColor = '#F5F5F5',
  style,
}) => (
  <StyledCard bordered={bordered} className={className} bodyStyle={style}>
    {header ? (
      header
    ) : (
      <Header>
        <Title>{title}</Title>
        {appliedPercentage >= 80 && (
          <StyledTag icon={<ExclamationCircleOutlined />} color="warning">
            Excessive resources used
          </StyledTag>
        )}
      </Header>
    )}

    <StyledProgress
      percent={appliedPercentage}
      strokeColor={appliedColor}
      success={{ percent: usedPercentage, strokeColor: usedColor }}
      strokeLinecap="butt"
      showInfo={false}
    />
    <Statistics>
      <Statistic>
        <Cricle color={usedColor} />
        <div>
          {usedTitle}
          <Info>
            <CountNumber>{used}</CountNumber>
            <CountText>{unit}</CountText>
          </Info>
        </div>
      </Statistic>
      <Statistic>
        <Cricle color={appliedColor} />
        <div>
          {appliedTitle}
          <Info>
            <CountNumber>{applied}</CountNumber>
            <CountText>{unit}</CountText>
          </Info>
        </div>
      </Statistic>
      <Statistic>
        <Cricle color={totalColor} />
        <div>
          {totalTitle}
          <Info>
            <CountNumber>{total}</CountNumber>
            <CountText>{unit}</CountText>
          </Info>
        </div>
      </Statistic>
    </Statistics>
  </StyledCard>
)

export default Usage
