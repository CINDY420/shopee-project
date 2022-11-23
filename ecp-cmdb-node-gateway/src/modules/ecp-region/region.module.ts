import { EcpRegionGuard } from '@/modules/ecp-region/region.guard'
import { EcpRegionService } from '@/modules/ecp-region/region.service'
import { DynamicModule, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

@Module({})
export class EcpRegionModule {
  static forRoot(): DynamicModule {
    return {
      module: EcpRegionModule,
      providers: [
        {
          provide: APP_GUARD,
          useClass: EcpRegionGuard,
        },
        EcpRegionService,
      ],
      exports: [EcpRegionService],
      global: true,
    }
  }
}
