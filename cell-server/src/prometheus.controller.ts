import { Controller, Get, Query } from '@nestjs/common'
import { PrometheusService } from '@/prometheus.service'

@Controller()
export class PrometheusController {
  constructor(private readonly prometheusService: PrometheusService) {}

  @Get()
  getRoot() {
    return 'Hello prometheus!'
  }

  @Get('metrics')
  getMetrics(@Query('type') type: string) {
    if (type === 'json') {
      return this.prometheusService.getJSONMetrics()
    }
    return this.prometheusService.getMetrics()
  }
}
