import { GitlabController } from '@/features/gitlab/gitlab.controller'
import { GitlabService } from '@/features/gitlab/gitlab.service'
import { Module } from '@nestjs/common'
import { UserModule } from '@/features/user/user.module'
import { HttpModule } from '@infra-node-kit/http'

@Module({
  controllers: [GitlabController],
  providers: [GitlabService],
  imports: [HttpModule, UserModule],
  exports: [GitlabService],
})
export class GitlabModule {}
