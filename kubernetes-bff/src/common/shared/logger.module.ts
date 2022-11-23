import { Global, Module } from '@nestjs/common'
import { Logger } from 'common/helpers/logger'

@Global()
@Module({
  providers: [Logger],
  exports: [Logger]
})
export class LoggerModule {}
