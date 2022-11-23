import { SESSION_NAME } from '@/common/constants/jwt'
import { Public } from '@/common/decorators/public.decorator'
import { GitlabAuthGuard } from '@/common/guards/gitlab-auth.guard'
import { AuthService } from '@/features/auth/auth.service'
import { GetAuthLoginQuery, GetAuthLoginResponse } from '@/features/auth/dtos/auth-login.dto'
import { IJwtBody } from '@/features/auth/strategies/jwt.strategy'
import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // gitlab url: https://git.garena.com/oauth/authorize?client_id=d10eb7f707b5d3808ec0031fb7a8f9700824fe660741eebd169c1b8e40ab4d44&redirect_uri=http://localhost:3000/api/v1/auth/login&response_type=code
  @Get('login')
  @Public()
  @UseGuards(GitlabAuthGuard)
  login(
    @Query() _: GetAuthLoginQuery,
    @Req() req: Request & { user: IJwtBody },
    @Res({ passthrough: true }) res: Response,
  ): GetAuthLoginResponse {
    const accessToken = this.authService.login(req.user)

    res.cookie(SESSION_NAME, accessToken)

    return {
      accessToken,
    }
  }
}
