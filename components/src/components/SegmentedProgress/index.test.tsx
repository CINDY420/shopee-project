import SegmentedProgress, { ISegment } from '@/components/SegmentedProgress'
import { render, waitFor } from '@testing-library/react'
import { Space, Statistic, Typography } from 'infrad'
import userEvent from '@testing-library/user-event'

const { Text } = Typography

const mockSegments: ISegment[] = [
  {
    value: 10,
    color: '#4D94EB',
    title: 'Segment1',
    unit: 'Cores',
    tooltipText: 'segment tooltip text',
  },
  { value: 50, color: '#A6D4FF', title: 'Segment2', unit: 'Cores' },
  { value: 100, color: '#F5F5F5', title: 'Total', unit: 'Cores' },
]
const mockMultipleSegments: ISegment[] = [
  { value: 10, color: '#20B2AA', title: 'Segment1', unit: 'Cores' },
  { value: 20, color: '#4D94EB', title: 'Segment2', unit: 'Cores', level: 2 },
  { value: 20, color: '#40E0D0', title: 'Segment3', unit: 'Cores', level: 4 },
  { value: 20, color: '#FFF68F', title: 'Segment4', unit: 'Cores', level: 1 },
  { value: 50, color: '#A6D4FF', title: 'Segment5', unit: 'Cores', level: 1 },
  { value: 50, color: '#F4A460', title: 'Segment6', level: 5 },
  { value: 100, color: '#F5F5F5', title: 'Total', unit: 'Cores' },
]
const mockClassName = 'segmentProgress'
const mockSegmentsWithCustomLegendRender: ISegment[] = [
  {
    value: 10,
    color: '#4D94EB',
    title: 'Segment1',
    unit: 'Cores',
    tooltipText: 'text',
    legendRender: (
      <Space style={{ marginBottom: '14px' }} size={4}>
        <Statistic title="segment1 custom legend" />
        <div>10</div>
      </Space>
    ),
  },
  { value: 20, color: '#A6D4FF', title: 'Segment2', unit: 'Cores' },
  { value: 100, color: '#F5F5F5', title: 'Total', unit: 'Cores' },
]

const mockHeight = 8
const mockWidth = 100
const mockTitle = (
  <div style={{ fontSize: '14px', fontWeight: '400', marginBottom: '4px' }}>1.6/8 Cores</div>
)

describe('SegmentedProgress', () => {
  test('Basic Usage', async () => {
    const { container, getByText, getByRole } = render(
      <SegmentedProgress title="CPU" segments={mockSegments} className={mockClassName} />,
    )

    const titleText = getByText('CPU')
    const tooltipElement = getByRole('img')
    const segmentProgressRoot = container.firstElementChild
    const segmentProgressWrapperElement = segmentProgressRoot?.children[1]
    const segmentsLegendWrapperElement = segmentProgressRoot?.lastElementChild
    const theFirstSegmentProgress = segmentProgressWrapperElement?.firstElementChild
    const theSecondSegmentProgress = segmentProgressWrapperElement?.children[1]
    const theThirdSegmentProgress = segmentProgressWrapperElement?.lastElementChild

    expect(titleText).toBeInTheDocument()
    expect(tooltipElement).toBeInTheDocument()
    expect(tooltipElement).toHaveClass('anticon anticon-info-circle')

    expect(segmentProgressRoot?.childElementCount).toBe(3)
    expect(segmentProgressWrapperElement?.childElementCount).toBe(mockSegments.length)
    expect(segmentsLegendWrapperElement).toBeInTheDocument()
    expect(segmentsLegendWrapperElement?.childElementCount).toBe(mockSegments.length)
    expect(theFirstSegmentProgress).toHaveStyle(
      'width: 10%; background-color: rgb(77, 148, 235); z-index: 3;',
    )
    expect(theSecondSegmentProgress).toHaveStyle(
      'width: 50%; background-color: rgb(166, 212, 255); z-index: 2;',
    )
    expect(theThirdSegmentProgress).toHaveStyle(
      'width: 100%; background-color: rgb(245, 245, 245); z-index: 1;',
    )
    await userEvent.hover(tooltipElement)
    await waitFor(() => {
      expect(getByRole('img')).toHaveClass('anticon anticon-info-circle ant-tooltip-open')
      expect(getByText('segment tooltip text')).toBeInTheDocument()
    })
  })

  test('segments props', () => {
    const { container } = render(
      <SegmentedProgress title="CPU" segments={mockMultipleSegments} className={mockClassName} />,
    )
    const segmentProgressRoot = container.firstElementChild
    const segmentProgressWrapperElement = segmentProgressRoot?.children[1]
    const segmentsLegendWrapperElement = segmentProgressRoot?.lastElementChild

    expect(segmentProgressWrapperElement?.childElementCount).toBe(mockMultipleSegments.length)
    expect(segmentsLegendWrapperElement?.childElementCount).toBe(mockMultipleSegments.length)
  })

  test('custom segment legendRender', () => {
    const { container, getByText } = render(
      <SegmentedProgress
        title="CPU"
        segments={mockSegmentsWithCustomLegendRender}
        className={mockClassName}
      />,
    )
    const segmentProgressRoot = container.firstElementChild
    const segmentsLegendWrapperElement = segmentProgressRoot?.lastElementChild
    const firstSegmentLegend = segmentsLegendWrapperElement?.firstElementChild

    expect(getByText('segment1 custom legend')).toBeInTheDocument()
    expect(firstSegmentLegend?.getElementsByClassName('ant-space-item').length).toBe(2)
  })

  test('hidden segmentsLegend', () => {
    const { container } = render(
      <SegmentedProgress legendVisible={false} title="CPU" segments={mockSegments} />,
    )

    const segmentProgressRoot = container.firstElementChild
    expect(segmentProgressRoot?.childElementCount).toBe(2)
  })
  test('custom style', () => {
    const { container, getByText } = render(
      <SegmentedProgress
        width={mockWidth}
        height={mockHeight}
        title={mockTitle}
        segments={[
          {
            value: 1.6,
            color: '#A6D4FF',
            title: 'Segment1',
            tooltipText: 'text',
            legendRender: (
              <Text type="secondary" style={{ marginTop: '-20px' }}>
                20%
              </Text>
            ),
          },
          { value: 8, color: '#F5F5F5', title: 'Total', unit: 'Cores', legendRender: null },
        ]}
      />,
    )
    const titleText = getByText('1.6/8 Cores')
    const segmentProgressRoot = container.firstElementChild
    const segmentProgressWrapperElement = segmentProgressRoot?.children[1]
    const segmentsLegendWrapperElement = segmentProgressRoot?.lastElementChild
    const theFirstSegmentProgress = getByText('20%')

    expect(titleText).toBeInTheDocument()
    expect(segmentProgressRoot).toHaveStyle('width: 100px;')
    expect(segmentProgressWrapperElement).toHaveStyle('height: 8px;')
    expect(segmentsLegendWrapperElement?.childElementCount).toBe(2)
    expect(theFirstSegmentProgress).toBeInTheDocument()
  })
})
