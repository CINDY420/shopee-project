import type { Property } from 'csstype'
import React from 'react'
import { Row, Typography, Tooltip } from 'infrad'
import {
  Circle,
  SegmentWrapper,
  SegmentValue,
  SegmentUnit,
  SegmentsLegendWrapper,
  SegmentProgressWrapper,
  SegmentProgress,
} from '@/components/SegmentedProgress/style'
import { InfoCircleOutlined } from 'infra-design-icons'
import { orderBy } from 'lodash'
import { CSSProperties } from 'styled-components'

export interface ISegment {
  /**
   * value of segment
   */
  value: number
  /**
   * color of segment
   */
  color: Property.Color
  /**
   * title of segment
   */
  title: string
  /**
   * unit of segment
   */
  unit?: string
  /**
   * TooltipText of segment
   */
  tooltipText?: string
  /**
   * SegmentInfo to display the value and unit for segment
   */
  legendRender?: React.ReactNode
  /**
   * Level of segment
   */
  level?: number
}

export interface ISegmentedProgressProps {
  /**
   * Width for progress bar
   */
  width?: number
  /**
   * Width for progress bar
   */
  height?: number
  /**
   * Title for segmentedProgress
   */
  title: string | React.ReactNode
  /**
   * Segments for progress bar
   */
  segments: ISegment[]
  /**
   * ClassName
   */
  className?: string
  /**
   * Whether to display the value and unit for quota
   */
  legendVisible?: boolean
  /**
   * React style
   */
  progressStyle?: CSSProperties
}

const { Title } = Typography

const defaultSegmentLegendRender = (segment: ISegment) => {
  const { value, title, color, unit, tooltipText } = segment
  return (
    <SegmentWrapper>
      <Row align="middle">
        <Circle color={color} style={{ lineHeight: '22px' }} />
        <Typography.Text style={{ marginLeft: '8px' }}>{title}</Typography.Text>
        {!!tooltipText && (
          <Tooltip title={tooltipText}>
            <InfoCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)', marginLeft: 4 }} />
          </Tooltip>
        )}
      </Row>
      <Row align="middle">
        <SegmentValue style={{ marginLeft: '20px' }}>{value}</SegmentValue>
        <SegmentUnit style={{ marginLeft: '7px' }}>{unit}</SegmentUnit>
      </Row>
    </SegmentWrapper>
  )
}

const renderQuoteInfo = (quota: ISegment) => {
  const { legendRender: quotaInfoRender = defaultSegmentLegendRender(quota) } = quota
  return <SegmentWrapper>{quotaInfoRender}</SegmentWrapper>
}

const SegmentedProgress: React.FC<ISegmentedProgressProps> = ({
  width,
  title,
  segments,
  className,
  height = 16,
  legendVisible = true,
  progressStyle,
}) => {
  const sortedSegmentByLevel = orderBy(segments, ['value', 'level'], ['asc', 'desc'])?.map(
    (item, index) => {
      const totalValue = segments[segments.length - 1].value
      return {
        ...item,
        percent: (item.value / totalValue) * 100,
        zIndex: segments.length - index,
      }
    },
  )
  return (
    <div style={{ width: `${width}px` }} className={className}>
      <div>{typeof title === 'string' ? <Title level={3}>{title}</Title> : title}</div>
      <SegmentProgressWrapper style={{ height: `${height}px` }}>
        {sortedSegmentByLevel?.map((segment) => {
          const { title, percent, color, zIndex } = segment
          return (
            <SegmentProgress
              key={title}
              width={percent}
              backgroundColor={color}
              zIndex={zIndex}
              style={progressStyle}
            />
          )
        })}
      </SegmentProgressWrapper>
      {legendVisible && (
        <SegmentsLegendWrapper>
          {segments?.map((segment) => (
            <div key={segment.title} style={{ width: `${(1 / segments.length) * 100}%` }}>
              {renderQuoteInfo(segment)}
            </div>
          ))}
        </SegmentsLegendWrapper>
      )}
    </div>
  )
}

export default SegmentedProgress
