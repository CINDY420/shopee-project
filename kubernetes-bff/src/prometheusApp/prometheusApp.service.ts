import { Injectable } from '@nestjs/common'
import { register } from 'common/prometheusClient/promClient'

@Injectable()
export class PrometheusAppService {
  async getMetrics() {
    return await register.metrics()
  }
}
