import { Global, Module } from '@nestjs/common'
import { ClientManagerService } from './client-manager.service'
@Global()
@Module({
  providers: [ClientManagerService],
  exports: [ClientManagerService]
})
export class ClientManagerModule {}
