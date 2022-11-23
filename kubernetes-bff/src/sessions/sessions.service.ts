import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CreateSessionDto, ICreateSessionDtoResponse } from './dto/create-session.dto'
import { IGoogleUser, IProxy } from './entities/session.entity'
import { UsersService } from 'users/users.service'
import { ESService } from 'common/modules/es/es.service'
import { ESIndex } from 'common/constants/es'

import { parseUserNameFromEmail } from 'common/helpers/user'
import { UNAUTHORIZED_USER_MAIN_DEPARTMENT } from 'common/constants/rbac'

import { GlobalService } from 'global/global.service'

import axios from 'axios'
import { Logger } from 'common/helpers/logger'

@Injectable()
export class SessionsService {
  // private logger: Logger = new Logger(SessionsService.name)
  private logger: Logger = new Logger(SessionsService.name)

  constructor(private userService: UsersService, private eSService: ESService, private globalService: GlobalService) {}

  async create(createSessionDto: CreateSessionDto): Promise<ICreateSessionDtoResponse> {
    const accesstoken = createSessionDto.googleAccessToken
    const googleUrl = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accesstoken}`

    const proxy = this.getProxy()

    let response
    try {
      response = await axios.get(googleUrl, { proxy })
    } catch (e) {
      switch (e.response.status) {
        case 401:
          throw new UnauthorizedException('Invalid credentials')
        default:
          throw e
      }
    }

    const googleUser = response.data as IGoogleUser
    const { email, picture } = googleUser
    const session = { email, name: email, avatar: picture }

    return session as any
  }

  getProxy(): IProxy {
    const settings = this.globalService.getSettings()
    const { proxy } = settings || {}
    if (!proxy) {
      this.logger.warn('no proxy!')
    } else {
      this.logger.log(`The proxy is ${proxy.host}:${proxy.port}`)
    }
    return proxy
  }

  async getSessionByEmail(email: string): Promise<ICreateSessionDtoResponse> {
    let userESInfo = await this.userService.getUserWithEmail(email)
    if (userESInfo == null) {
      const newUser = {
        userid: email,
        name: parseUserNameFromEmail(email),
        email: email,
        main_department: UNAUTHORIZED_USER_MAIN_DEPARTMENT,
        position: '',
        role: ''
      }
      userESInfo = newUser
      // 新用户写入ES
      await this.eSService.index(ESIndex.USER, newUser)
    }

    const userDepartmentPath = await this.userService.getUserDepartmentPathWithID(userESInfo.main_department)
    if (userDepartmentPath.length === 0) {
      this.logger.error(
        `Failed to get user department from es with department id ${userESInfo.main_department} and user email is ${email}`
      )
    }

    return {} as any
  }
}
