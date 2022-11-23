import client from 'prom-client'
import { Injectable } from '@nestjs/common'

const collectDefaultMetrics = client.collectDefaultMetrics
// It is a class, should use PascalCase
// eslint-disable-next-line @typescript-eslint/naming-convention
const { Registry } = client
const register = new Registry()
collectDefaultMetrics({ register })

@Injectable()
export class PrometheusService {
  getMetrics() {
    return register.metrics()
  }

  getJSONMetrics() {
    return register.getMetricsAsJSON()
  }
}
