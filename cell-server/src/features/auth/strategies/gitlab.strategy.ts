import { GITLAB_STRATEGY_NAME } from '@/common/constants/gitlab'
import { IJwtBody } from '@/features/auth/strategies/jwt.strategy'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-gitlab2'

interface IUserEmail {
  value: string
}

interface IGitlabProfile {
  username: string
  emails: IUserEmail[]
  displayName: string
  id: string
}

@Injectable()
export class GitlabStrategy extends PassportStrategy(Strategy, GITLAB_STRATEGY_NAME) {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('applicationId'),
      clientSecret: configService.get<string>('applicationSecret'),
      baseURL: configService.get<string>('gitlabBaseUrl'),
      callbackURL: configService.get<string>('gitlabRedirectUrl'),

      /*
       * scope: [
       *   'api',
       *   'read_user',
       *   'read_api',
       *   'read_repository',
       *   'write_repository',
       *   'sudo',
       * ],
       */
    })
  }

  validate(
    accessToken: string,
    _refreshToken: string,
    profile: IGitlabProfile,
    done: (err: Error | null, data: IJwtBody) => void,
  ) {
    const user = {
      username: profile.username,
      gitlabUserId: profile.id,
      email: profile.emails[0].value,
      gitlabToken: accessToken,
    }
    done(null, user)
  }
}
