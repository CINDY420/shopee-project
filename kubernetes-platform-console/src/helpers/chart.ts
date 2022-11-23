import { formatFloat, formatHourTime } from 'helpers/format'

/**
 * Format the data to meet the needs of DoughnutChart
 *
 * @param data array of series data
 * @param formatDataFn function to format the value
 * @example
 *   params:
 *      data: [[20, 'Applied', '#8b7eee'], [10, 'Reversed', '#455184']]
 *   result: [{
 *     value: 20,
 *     name: 'Applied',
 *     itemStyle: {
 *       color: '#8b7eee'
 *     }
 *   },{
 *     value: 10,
 *     name: 'Reversed',
 *     itemStyle: {
 *       color: '#455184'
 *     }
 *   }]
 */
export const formatSeriesData = (data: any, formatDataFn?: () => number) => {
  const formatData: any = []
  const formatFn = formatDataFn || formatFloat

  data.forEach((item: any) => {
    formatData.push({
      value: formatFn(item[0]),
      name: item[1],
      itemStyle: {
        color: item[2]
      }
    })
  })

  return formatData
}

/**
 * Format the graph data to meet the needs of AreaChart
 *
 * @param graph graph data obtained by the server
 * @param formatDataFn function to format the value
 * @example
 *    params:
 *       graph: [{x: "2019-09-05T06:21:08Z", y: 0.005284722222616889}, {x: "2019-09-05T06:26:08Z" y: 0.00197916666673148}]
 *       formatDataFn: (value) => parseFloat(value.toFixed(3))
 *    result:
 *       {
 *         '06:21': 0.005,
 *         '06:26': 0.002
 *       }
 */
export const formatAreaChartData = (graph: any, formatDataFn?: any) => {
  const data: any = {}
  const formatData = formatDataFn || ((val: any) => val)

  if (graph) {
    graph.forEach((item: any) => {
      const time = formatHourTime(item.x)
      data[time] = formatData(item.y)
    })
  }
  return data
}
