import { Module } from '@nestjs/common'
import { PrometheusAppController } from './prometheusApp.controller'
import { PrometheusAppService } from './prometheusApp.service'

@Module({
  controllers: [PrometheusAppController],
  providers: [PrometheusAppService]
})
export class PrometheusAppModule {}
