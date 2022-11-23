import { zenoMonitorInstance } from '@/common/utils/zeno-monitor-instance'
import { Controller, Get } from '@nestjs/common'

@Controller('api')
export class PingController {
  @Get('ping')
  pong(): { pong: number } {
    zenoMonitorInstance.getMetric('demo_request_times').inc()
    return {
      pong: Date.now(),
    }
  }
}
