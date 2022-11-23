import { Module } from '@nestjs/common'
import { AuthInfoProvider } from '@/shared/auth/auth-info.provider'

@Module({
  providers: [AuthInfoProvider],
  exports: [AuthInfoProvider],
})
export class AuthModule {}
