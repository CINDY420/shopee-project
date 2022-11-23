import { ERROR } from '@/common/constants/error'
import { jwtConstants, JWT_STRATEGY_NAME, SESSION_NAME } from '@/common/constants/jwt'
import { throwError } from '@/common/utils/throw-error'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

export interface IJwtBody {
  username: string
  gitlabUserId: string
  email: string
  gitlabToken: string
}

function cookieExtractor(req: Request): string | null {
  return req && req.cookies ? req.cookies[SESSION_NAME] : null
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY_NAME) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
    })
  }

  validate(payload: IJwtBody) {
    // todo: add validate for payload properties
    if (payload === null) {
      throwError(ERROR.SYSTEM_ERROR.AUTH.GITLAB_UNAUTHORIZED_ERROR)
    }
    return payload
  }
}
