import { Module } from '@nestjs/common'
import { SessionController } from '@/features/session/session.controller'

@Module({
  controllers: [SessionController],
})
export class SessionModule {}
