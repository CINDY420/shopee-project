import { FetchModule } from '@/modules/fetch/fetch.module'
import { ZoneController } from '@/modules/zone/zone.controller'
import { ZoneService } from '@/modules/zone/zone.service'
import { Module } from '@nestjs/common'

@Module({
  controllers: [ZoneController],
  imports: [FetchModule],
  providers: [ZoneService],
})
export class ZoneModule {}
