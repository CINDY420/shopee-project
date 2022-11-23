import { HttpException } from '@nestjs/common'

export class MetricsException extends HttpException {
  constructor(status: number, message: string) {
    super(message, status)
  }
}
