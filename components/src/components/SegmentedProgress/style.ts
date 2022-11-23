import styled from 'styled-components'

interface ICircleProps {
  color?: string
}

export const Circle = styled.div<ICircleProps>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => props.color || 'red'};
`

export const SegmentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const SegmentValue = styled.div`
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
`
export const SegmentUnit = styled.div`
  font-weight: 400;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  height: 20px;
  line-height: 20px;
  align-self: flex-end;
`
export const SegmentsLegendWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: row;
`

export const SegmentProgressWrapper = styled.div`
  position: relative;
`

interface ISegmentProgressProps {
  width: number
  backgroundColor: string
  zIndex: number
}

export const SegmentProgress = styled.div<ISegmentProgressProps>`
  height: 100%;
  position: absolute;
  width: ${(props) => `${props.width}%`};
  background-color: ${(props) => props.backgroundColor};
  z-index: ${(props) => props.zIndex};
`
