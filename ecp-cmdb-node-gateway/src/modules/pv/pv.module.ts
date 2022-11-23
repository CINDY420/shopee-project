import { Module } from '@nestjs/common'
import { PVService } from '@/modules/pv/pv.service'
import { FetchModule } from '@/modules/fetch/fetch.module'
import { PVController } from '@/modules/pv/pv.controller'

@Module({
  controllers: [PVController],
  imports: [FetchModule],
  providers: [PVService],
  exports: [PVService],
})
export class PVModule {}
