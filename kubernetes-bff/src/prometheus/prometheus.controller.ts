import { Controller, Post, Body } from '@nestjs/common'
import { PrometheusService } from './prometheus.service'
import { ApiProperty } from '@nestjs/swagger'

interface IPostPerformancePayload {
  loadingDuration: number
}
class PerformanceBodyDto {
  @ApiProperty()
  loadingDuration: number
}

@Controller('prometheus')
export class PrometheusController {
  constructor(private readonly prometheusService: PrometheusService) {}

  // A post api to monitor FE web performance (loading duration)
  @Post('performance')
  postPerformance(@Body() payload: PerformanceBodyDto) {
    return this.prometheusService.postPerformance(payload)
  }
}
