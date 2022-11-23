import ReactEcharts from 'echarts-for-react'
import * as React from 'react'
import styled from 'styled-components'
import { Empty } from 'infrad'
import { CenterWrapper } from 'common-styles/flexWrapper'

const ChartWrapper: any = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-width: ${(props: any) => props.wrapperMinWidth || '15em'};
  min-height: ${(props: any) => props.wrapperMinHeight || '15em'};
`
const ChartTip = styled.div`
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
`

const ChartTitle = styled.div`
  text-align: center;
  color: #555;
  font-size: 1.3em;
  font-weight: bold;
`

const ChartContent = styled.div`
  position: relative;
`

interface IBaseProps {
  title?: string
  children?: React.ReactNode
  empty?: boolean
  option: any
  style?: object
}

const Base: React.FC<IBaseProps> = params => {
  return (
    <ChartWrapper {...params}>
      {params.title && <ChartTitle>{params.title}</ChartTitle>}
      {params.empty ? (
        <CenterWrapper>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </CenterWrapper>
      ) : (
        <ChartContent>
          <ReactEcharts option={params.option} style={params.style} />
          <ChartTip>{params.children}</ChartTip>
        </ChartContent>
      )}
    </ChartWrapper>
  )
}

export default Base
