import { Module, forwardRef } from '@nestjs/common'
import { UserLogsService } from './logs.service'
import { UserLogsController } from './logs.controller'

import { ESModule } from 'common/modules/es/es.module'

@Module({
  controllers: [UserLogsController],
  providers: [UserLogsService],
  imports: [forwardRef(() => ESModule)],
  exports: [UserLogsService]
})
export class UserLogsModule {}
