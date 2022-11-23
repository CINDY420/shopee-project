import { Controller, Get, Post, Body, Delete, Res, Headers } from '@nestjs/common'
import { SessionsService } from './sessions.service'
import { CreateSessionDto, ICreateSessionDtoResponse } from './dto/create-session.dto'
import { ApiTags } from '@nestjs/swagger'
import { CookieOptions, Response } from 'express'
import { AuthUser, IAuthUser } from 'common/decorators/parameters/AuthUser'
import { JWT_COOKIE_KEY, JWT_SECRET, ONE_DAY, FOREVER } from 'common/constants/sessions'
import { AUDIT_RESOURCE_TYPE } from 'common/constants/auditResourceType'
import { AuditResourceType } from 'common/decorators/parameters/AuditResourceType'
import { AuthService } from 'common/modules/auth/auth.service'

const SECURE_COOKIE_OPTIONS: CookieOptions = {
  path: '/',
  secure: true,
  sameSite: 'none'
}

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService, private readonly authService: AuthService) {}

  @Post()
  async create(
    @Headers('Origin') origin = '',
    @Body() createSessionDto: CreateSessionDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ICreateSessionDtoResponse> {
    const { googleAccessToken } = createSessionDto
    const authToken = await this.authService.getAccessToken(googleAccessToken)
    const jwtSession = await this.authService.verifyToken(authToken)
    const { ID: userId } = jwtSession

    const isEncryptedOrigin = origin.startsWith('https')
    res.cookie(JWT_COOKIE_KEY, authToken, isEncryptedOrigin ? SECURE_COOKIE_OPTIONS : undefined)

    const session = await this.sessionsService.create(createSessionDto)
    return { userId, ...session }
  }

  @Get('')
  @AuditResourceType(AUDIT_RESOURCE_TYPE.SESSION)
  findOne(@AuthUser() authUser: IAuthUser) {
    return authUser
  }

  @Delete()
  @AuditResourceType(AUDIT_RESOURCE_TYPE.SESSION)
  remove(@Headers('Origin') origin = '', @Res({ passthrough: true }) res: Response) {
    res.clearCookie(JWT_COOKIE_KEY, origin.startsWith('https') ? SECURE_COOKIE_OPTIONS : undefined)
    return {}
  }
}
