import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ISpaceUser, RequireLogin, User } from '@infra-node-kit/space-auth'
import { UserService } from '@/features/user/user.service'
import { GetUserResponse } from '@/features/user/dto/user.dto'

@ApiTags('User')
@Controller()
@RequireLogin(true)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  getUser(@User() user: ISpaceUser): Promise<GetUserResponse> {
    const { email } = user
    return this.userService.getUser(email)
  }
}
