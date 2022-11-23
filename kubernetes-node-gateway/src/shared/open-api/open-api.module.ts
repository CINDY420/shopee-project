import { Module, Global } from '@nestjs/common'
import { OpenApiService } from '@/shared/open-api/open-api.service'
import { AuthModule } from '@/shared/auth/auth.module'

@Global()
@Module({
  imports: [AuthModule],
  exports: [OpenApiService],
  providers: [OpenApiService],
})
export class OpenApiModule {}
