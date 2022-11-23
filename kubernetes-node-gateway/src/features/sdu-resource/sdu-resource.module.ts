import { Module } from '@nestjs/common'
import { SduResourceService } from './sdu-resource.service'
import { SduResourceController } from './sdu-resource.controller'
import { OpsPlatformModule } from '@/shared/ops-platform/ops-platform.module'

@Module({
  imports: [OpsPlatformModule],
  controllers: [SduResourceController],
  providers: [SduResourceService],
})
export class SduResourceModule {}
