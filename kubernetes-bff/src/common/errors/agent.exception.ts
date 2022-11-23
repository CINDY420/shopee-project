import { HttpException } from '@nestjs/common'

export class AgentException extends HttpException {
  constructor(status: number, message: string) {
    super(message, status)
  }
}
