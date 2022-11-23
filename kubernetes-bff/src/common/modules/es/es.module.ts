import { Global, Module } from '@nestjs/common'
import { ESService } from './es.service'

@Global()
@Module({
  providers: [ESService],
  exports: [ESService]
})
export class ESModule {}
