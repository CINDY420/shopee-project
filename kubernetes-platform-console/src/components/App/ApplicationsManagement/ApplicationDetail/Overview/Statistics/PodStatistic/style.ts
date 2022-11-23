import styled from 'styled-components'

interface IProps {
  count: number
}

export const Wrapper = styled.div<IProps>`
  position: relative;
  width: ${props => (props.count >= 7 && props.count <= 8 ? '25%' : '16.6%')};
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ChartWrapper = styled.div`
  width: 190px;
  height: 190px;
`

export const Title = styled.div`
  font-size: 20px;
  color: #333333;
`

export const LegendWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 48px;
  user-select: none;
`

export const Legend = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 4px;
  cursor: pointer;
`

interface ICircleProps {
  isAbnormal?: boolean
}

export const Circle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props: ICircleProps) => (props.isAbnormal ? '#EE4D2D' : '#6FC9CA')};
  margin-right: 8px;
`

export const Total = styled.span`
  font-size: 22px;
  color: #151515;
  letter-spacing: 0;
  line-height: 16px;
  margin-left: 8px;
`
