import { Module } from '@nestjs/common'
import { RbacService } from './rbac.service'
import { RbacController } from './rbac.controller'
import { AuthModule } from '@/shared/auth/auth.module'

@Module({
  controllers: [RbacController],
  providers: [RbacService],
  imports: [AuthModule],
})
export class RbacModule {}
