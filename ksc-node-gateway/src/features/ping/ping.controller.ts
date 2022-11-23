import { Controller, Get } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

import { PingResponseDto } from '@/features/ping/dtos/ping.dto'

@Controller('/')
export class PingController {
  @Get('ping')
  @ApiResponse({ status: 200, type: PingResponseDto, description: 'Check alive' })
  pong() {
    return {
      pong: Date.now(),
    }
  }
}
