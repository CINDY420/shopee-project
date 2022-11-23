import { Module, CacheModule, Global } from '@nestjs/common'
import { OpenApiService } from './openApi.service'

@Global()
@Module({
  imports: [CacheModule.register()],
  providers: [OpenApiService],
  exports: [OpenApiService]
})
export class OpenApiModule {}
