import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ISpaceUIC } from '@/configs/interface'
import { PostApisUicV2AuthTokenValidateResDto } from '@/rapper/spaceUIC/dtos/post-apis-uic-v2-auth-token_validate.dto'
import { createFetch } from '@/rapper/spaceUIC/client'
import { HttpService } from '@infra-node-kit/http'
import { AUTH_USER_INFO } from '@/constants/auth'
import { IExpressRequestWithContext } from '@/interfaces/auth'
import axios from 'axios'
import { throwError } from '@infra-node-kit/exception'
import { AUTH_ERROR } from '@/constants/error'
import { logger } from '@infra-node-kit/logger'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IExpressRequestWithContext>()
    const bearToken = request.headers.authorization

    if (!bearToken) {
      throwError(AUTH_ERROR.NO_BEARER_TOKEN)
    }
    const userInfo = await this.validateSpaceToken(bearToken)

    // set user info
    request[AUTH_USER_INFO] = userInfo

    const userEmail = userInfo?.user?.email
    if (!userEmail) {
      throwError(AUTH_ERROR.TOKEN_WITHOUT_EMAIL)
    }

    return true
  }

  validateSpaceToken(bearToken: string): Promise<PostApisUicV2AuthTokenValidateResDto> {
    // Refer to https://confluence.shopee.io/pages/viewpage.action?spaceKey=STS&title=UIC+v2+API#UICv2API-TokenValidate
    const fetch = this.getFetch(bearToken)
    return fetch['POST/apis/uic/v2/auth/token_validate']()
  }

  getFetch(bearToken: string) {
    const spaceUicConfig = this.configService.get<ISpaceUIC>('spaceUIC')

    return createFetch(async ({ url, method, params }) => {
      try {
        const response = await this.httpService.request({
          baseURL: spaceUicConfig?.baseUrl || '',
          method,
          url,
          data: params,
          headers: { Authorization: bearToken },
        })
        return response.data
      } catch (error: unknown) {
        /**
         * Catch clause variable type annotation must be 'any' or 'unknown' if specified
         * Refer to https://stackoverflow.com/questions/42618089/how-do-you-use-typed-errors-in-async-catch
         */
        if (axios.isAxiosError(error)) {
          throwError({
            ...AUTH_ERROR.VALIDATE_BEARER_TOKEN_FAILED,
            status: error?.response?.status,
            data: error?.response?.data,
          })
        } else {
          logger.error('Catch unknown error of UIC token validate!')
          logger.stack(error)
          throwError(AUTH_ERROR.UNKNOWN_ERROR)
        }
      }
    })
  }
}
