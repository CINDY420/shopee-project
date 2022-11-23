import { Module } from '@nestjs/common'
import { ApplicationController } from '@/features/application/application.controller'
import { ApplicationService } from '@/features/application/application.service'
import { SpaceApiModule } from '@/shared/space-api/space-api.module'

@Module({
  imports: [SpaceApiModule],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
