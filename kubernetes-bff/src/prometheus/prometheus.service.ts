import { Injectable, BadRequestException } from '@nestjs/common'
import { loadingDurationHistogram } from 'common/prometheusClient/promClient'

interface IPostPerformanceProps {
  loadingDuration: number
}

@Injectable()
export class PrometheusService {
  postPerformance({ loadingDuration }: IPostPerformanceProps) {
    try {
      loadingDurationHistogram.observe(loadingDuration)
    } catch (err) {
      throw new BadRequestException(err)
    }
  }
}
