import { Controller, Get } from '@nestjs/common'
import { PrometheusAppService } from './prometheusApp.service'

@Controller()
export class PrometheusAppController {
  constructor(private readonly prometheusService: PrometheusAppService) {}
  @Get()
  getRoot() {
    return 'Hello prometheus!'
  }

  // An exporter api for Prometheus to scrape
  @Get('metrics')
  getMetrics() {
    return this.prometheusService.getMetrics()
  }
}
