import { HttpStatus } from '@nestjs/common'

export class CustomException extends Error {
  constructor(readonly message: string, readonly code: number, readonly status: HttpStatus) {
    super(message)
  }
}
