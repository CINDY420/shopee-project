import { Controller, Get, Query } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { UserLogsService } from './logs.service'

import { IListLogsQueryDto, IListLogsResponse } from './dto/log.dto'
import { AuthToken } from 'common/decorators/parameters/AuthToken'

@ApiTags('UserLogs')
@Controller()
export class UserLogsController {
  constructor(private readonly userLogsService: UserLogsService) {}

  @Get('operationLogs')
  @ApiResponse({ status: 200, type: IListLogsResponse, description: 'Get user operation log list' })
  listNodes(@AuthToken() authToken: string, @Query() query: IListLogsQueryDto) {
    return this.userLogsService.getUserOperationLogs({ ...query }, authToken)
  }
}
