import { Module } from '@nestjs/common'
import { AuthService } from '@/shared/auth/auth.service'
import { AuthInfoProvider } from '@/shared/auth/auth-info.provider'

@Module({
  imports: [],
  providers: [AuthService, AuthInfoProvider],
  exports: [AuthService, AuthInfoProvider],
})
export class AuthModule {}
