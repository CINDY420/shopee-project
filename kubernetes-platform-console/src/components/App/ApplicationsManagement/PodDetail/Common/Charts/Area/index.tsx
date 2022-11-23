import * as React from 'react'
import * as R from 'ramda'
import Base from 'components/App/ApplicationsManagement/PodDetail/Common/Charts/Base'

const baseOption = {
  title: {
    left: 'center',
    top: 'top'
  }
}

const baseTooltip = {
  trigger: 'axis',
  axisPointer: {
    type: 'cross',
    label: {
      backgroundColor: '#6a7985'
    }
  }
}

const baseXAxis: any = {
  type: 'category',
  boundaryGap: false,
  axisLine: {
    lineStyle: {
      color: '#aaa'
    }
  },
  axisLabel: {
    color: '#333'
  }
}

const baseYAxis: any = {
  type: 'value',
  axisLine: {
    show: false
  },
  axisTick: {
    show: false
  },
  minInterval: 0.01,
  offset: -5,
  splitLine: {
    lineStyle: {
      type: 'dashed',
      color: '#cdcdcd'
    }
  }
}

const baseSeries: any = [
  {
    type: 'line',
    itemStyle: {
      color: '#2f9aff'
    },
    lineStyle: {
      color: '#2f9aff'
    },
    areaStyle: {
      color: '#b8ddff'
    },
    smooth: 0.5
  }
]

interface IAreaChartProps {
  title?: string
  empty?: boolean
  dataMap: object
  showAxis?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  width?: number
  height?: number
  style?: object
  wrapperMinWidth?: string
  wrapperMinHeight?: string
  yAxisName?: string
  ySplitNumber?: number
  yMax?: number
  grid?: object
  customSeries?: object
}

const Area: React.FC<IAreaChartProps> = (params: IAreaChartProps) => {
  const xAxis = R.clone(baseXAxis)
  const yAxis: any = R.mergeDeepRight(R.clone(baseYAxis), params.customSeries || {})
  const series = R.clone(baseSeries)
  const tooltip = R.clone(baseTooltip)
  xAxis.data = Object.keys(params.dataMap)
  yAxis.name = params.yAxisName && `(${params.yAxisName})`
  yAxis.splitNumber = params.ySplitNumber
  series[0].data = Object.values(params.dataMap)
  xAxis.show = !(params.showXAxis === false)
  yAxis.show = !(params.showYAxis === false)

  if (params.yMax) {
    yAxis.max = params.yMax
  }

  if (params.showAxis === false) {
    xAxis.show = false
    yAxis.show = false
  }

  const option = {
    series,
    xAxis,
    yAxis,
    tooltip,
    width: params.width,
    height: params.height,
    grid: params.grid
  }

  const mergedOption = R.mergeDeepRight(baseOption, option)

  return <Base option={mergedOption} {...params} />
}

export default Area
