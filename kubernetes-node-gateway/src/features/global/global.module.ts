import { Module } from '@nestjs/common'
import { GlobalService } from './global.service'
import { GlobalController } from './global.controller'
import { OpenApiModule } from '@/shared/open-api/open-api.module'

@Module({
  imports: [OpenApiModule],
  controllers: [GlobalController],
  providers: [GlobalService],
})
export class GlobalModule {}
