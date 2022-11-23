/* eslint-disable */
import { HTTPFetch as fetch } from 'src/helpers/fetch'
import * as types from '../models'

export interface IPrometheusController_getMetricsParams {
  type: string
}

type PrometheusController_getMetricsFn = (
  params: IPrometheusController_getMetricsParams,
  extra?: any
) => Promise<any>

export const prometheusController_getMetrics: PrometheusController_getMetricsFn = async (
  { type },
  extra
) => {
  const body = await fetch(
    {
      resource: 'metrics',
      method: 'GET',
      params: { type }
    },
    extra
  )

  return body
}
