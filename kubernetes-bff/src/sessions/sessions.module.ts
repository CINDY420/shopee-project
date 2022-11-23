import { Module } from '@nestjs/common'
import { SessionsService } from './sessions.service'
import { SessionsController } from './sessions.controller'
import { UsersModule } from 'users/users.module'
import { GlobalModule } from 'global/global.module'
import { GlobalService } from 'global/global.service'

@Module({
  controllers: [SessionsController],
  providers: [SessionsService, GlobalService],
  imports: [UsersModule, GlobalModule],
  exports: [SessionsService]
})
export class SessionsModule {}
