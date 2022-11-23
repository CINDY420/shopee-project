import { Controller, Delete, HttpStatus, Post, Res, Headers, Body } from '@nestjs/common'
import { OpenApiService } from '@/common/modules/openApi/openApi.service'
import { ApiTags, ApiResponse } from '@nestjs/swagger'

import { Response, CookieOptions } from 'express'
import { CreateSessionPayload, CreateSessionResponse } from '@/features/session/dto/session.dto'
import { OPEN_API_TOKEN_KEY } from '@/common/constants/session'

const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
}

const SECURE_COOKIE_OPTIONS: CookieOptions = {
  secure: true,
  sameSite: 'none',
}

@ApiTags('session')
@Controller('session')
export class SessionController {
  constructor(private readonly openApiService: OpenApiService) {}
  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateSessionResponse, description: 'Login in by google' })
  async createSession(
    @Headers('Origin') origin = '',
    @Body() createSessionPayload: CreateSessionPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { googleAccessToken } = createSessionPayload
    const userInfo = await this.openApiService.login({ googleAccessToken })
    const { accessToken, userId, userName, email, avatar } = userInfo

    const cookieOptions = origin.startsWith('https')
      ? { ...DEFAULT_COOKIE_OPTIONS, ...SECURE_COOKIE_OPTIONS }
      : DEFAULT_COOKIE_OPTIONS
    response.cookie(OPEN_API_TOKEN_KEY, accessToken, cookieOptions)
    return { userId, userName, email, avatar }
  }

  @Delete()
  @ApiResponse({ status: HttpStatus.OK, description: 'Logout' })
  removeSession(@Headers('Origin') origin = '', @Res({ passthrough: true }) response: Response) {
    response.clearCookie(OPEN_API_TOKEN_KEY, origin.startsWith('https') ? SECURE_COOKIE_OPTIONS : undefined)
  }
}
