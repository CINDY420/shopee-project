import { Global, Module } from '@nestjs/common'
import { OpenApiService } from '@/common/modules/openApi/openApi.service'
import { OpenApiInfoProvider } from '@/common/modules/openApi/openApiInfo.provider'

@Global()
@Module({
  providers: [OpenApiService, OpenApiInfoProvider],
  exports: [OpenApiService, OpenApiInfoProvider],
})
export class OpenApiModule {}
