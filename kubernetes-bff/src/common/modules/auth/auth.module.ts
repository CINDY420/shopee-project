import { Module, CacheModule, Global } from '@nestjs/common'
import { AuthService } from 'common/modules/auth/auth.service'
import { PolicyModule } from 'policy/policy.module'

@Global()
@Module({
  imports: [CacheModule.register(), PolicyModule],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
