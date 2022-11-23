import { Controller, Get } from '@nestjs/common'

@Controller()
export class PingController {
  @Get('ping')
  pong(): { pong: number } {
    return {
      pong: Date.now(),
    }
  }
}
