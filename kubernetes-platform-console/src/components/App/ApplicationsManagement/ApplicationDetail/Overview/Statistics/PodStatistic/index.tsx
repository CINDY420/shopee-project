import * as React from 'react'
import ReactEcharts, { ReactEchartsPropsTypes } from 'echarts-for-react'

import { formatFloat } from 'helpers/format'
import { getDispatchers, ApplicationContext, POD_STATUS_FILTERS } from '../../useApplicationContext'

import { Wrapper, ChartWrapper, Title, LegendWrapper, Legend, Circle, Total } from './style'

interface IPodStatistics {
  environment: string
  normalPodCount: number
  abnormalPodCount: number
  count: number
  onClick: () => void
}

export enum POD_STATUS {
  NORMAL = 'Normal',
  ABNORMAL = 'Abnormal'
}

type IOption = ReactEchartsPropsTypes['option']

const PodStatistics: React.FC<IPodStatistics> = ({ environment, normalPodCount, abnormalPodCount, count, onClick }) => {
  const { dispatch } = React.useContext(ApplicationContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])

  const isPodExists = normalPodCount + abnormalPodCount !== 0

  const data = React.useMemo(() => {
    if (!normalPodCount && !abnormalPodCount) {
      return [{ value: abnormalPodCount, name: POD_STATUS.ABNORMAL }]
    }

    return [
      { value: abnormalPodCount, name: POD_STATUS.ABNORMAL },
      { value: normalPodCount, name: POD_STATUS.NORMAL }
    ]
  }, [abnormalPodCount, normalPodCount])

  const options: IOption = React.useMemo(() => {
    const percent = isPodExists ? formatFloat((normalPodCount / (normalPodCount + abnormalPodCount)) * 100) : '-'
    const color = '#333333'

    return {
      title: {
        text: `${POD_STATUS.NORMAL} Pod`,
        subtext: `${percent}%`,
        top: 70,
        left: 'center',
        textStyle: {
          fontSize: 12,
          color: color,
          lineHeight: 4
        },
        subtextStyle: {
          fontSize: 26,
          color: color,
          lineHeight: 26
        }
      },
      series: [
        {
          name: environment,
          type: 'pie',
          radius: [48, 72],
          label: {
            show: false
          },
          startAngle: 0,
          hoverOffset: 4,
          data: data
        }
      ],
      color: isPodExists ? ['#ee4d2d', '#6fc9ca'] : ['#dddddd']
    }
  }, [abnormalPodCount, data, environment, isPodExists, normalPodCount])

  const legends = React.useMemo(
    () => [
      {
        title: POD_STATUS.NORMAL,
        value: normalPodCount
      },
      {
        title: POD_STATUS.ABNORMAL,
        value: abnormalPodCount
      }
    ],
    [abnormalPodCount, normalPodCount]
  )

  const handleClick = React.useCallback(
    (podStatus: string, environment: string) => {
      dispatchers.selectStatistic({
        environment,
        podPhases: [],
        podStatus: isPodExists ? [POD_STATUS_FILTERS[podStatus]] : []
      })
      onClick && onClick()
    },
    [dispatchers, isPodExists, onClick]
  )

  const echartEvents = React.useMemo(
    () => ({
      click: ({ name: podStatus, seriesName: environment }) => {
        handleClick(podStatus, environment)
        onClick && onClick()
      }
    }),
    [handleClick, onClick]
  )

  return (
    <Wrapper count={count}>
      <Title>{environment}</Title>
      <ChartWrapper>
        <ReactEcharts option={options} onEvents={echartEvents} style={{ width: '100%', height: '100%' }} />
      </ChartWrapper>
      <LegendWrapper>
        {legends.map(legend => {
          const { title, value } = legend
          return (
            <Legend key={title} onClick={() => handleClick(title, environment)}>
              <Circle isAbnormal={title === POD_STATUS.ABNORMAL} />
              {title}: <Total>{value}</Total>
            </Legend>
          )
        })}
      </LegendWrapper>
    </Wrapper>
  )
}

export default PodStatistics
