import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ClusterService {
  constructor(private readonly configService: ConfigService) {}

  getDisabledScaleClusters() {
    const configs = this.configService.get<string[]>('ecpGlobalConfig.disabledScaleClusters') || []

    return {
      clusters: configs,
    }
  }
}
