import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entities/user.entity'
import moment from 'moment'
import { ERROR } from '@/common/constants/error'
import { throwError } from '@/common/utils/throw-error'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async recordUserActivity(email: string) {
    const user = await this.userRepository.findOne({ where: { email } })
    if (user) {
      await this.userRepository.save({
        ...user,
        lastActiveTime: moment().unix(),
      })
    } else {
      await this.userRepository.save({
        email,
        lastActiveTime: moment().unix(),
      })
    }

    return
  }

  async getUser(email: string) {
    const user = await this.userRepository.findOne({ where: { email } })
    if (!user) {
      throwError(ERROR.SYSTEM_ERROR.COMMON.EXECUTE_ERROR, `user ${email} not found`)
    }

    return user
  }
}
