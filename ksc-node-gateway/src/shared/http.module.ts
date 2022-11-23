import { Global, Module } from '@nestjs/common'
import { Http } from '@/common/utils/http'

@Global()
@Module({
  providers: [Http],
  exports: [Http],
})
export class HttpModule {}
