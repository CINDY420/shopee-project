import { Module } from '@nestjs/common'
import { ZoneService } from '@/features/zone/zone.service'
import { ZoneController } from '@/features/zone/zone.controller'

@Module({
  controllers: [ZoneController],
  imports: [ZoneService],
  providers: [ZoneService],
})
export class ZoneModule {}
