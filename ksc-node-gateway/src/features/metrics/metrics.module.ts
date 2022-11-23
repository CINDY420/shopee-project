import { Module } from '@nestjs/common'
import { MetricsController } from '@/features/metrics/metrics.controller'
import { MetricsService } from '@/common/modules/metrics/metrics.service'
@Module({
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}
