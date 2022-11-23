import { GITLAB_STRATEGY_NAME } from '@/common/constants/gitlab'
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GitlabAuthGuard extends AuthGuard(GITLAB_STRATEGY_NAME) {}
