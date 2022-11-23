import { Module, CacheModule, Global } from '@nestjs/common'
import { UssService } from 'common/modules/uss/uss.service'

@Global()
@Module({
  imports: [CacheModule.register()],
  providers: [UssService],
  exports: [UssService]
})
export class UssModule {}
