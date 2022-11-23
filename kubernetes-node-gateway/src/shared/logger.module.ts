import { Global, Module } from '@nestjs/common'
import { Logger } from '@/common/utils/logger'

@Global()
@Module({
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
