import { HttpException, HttpStatus } from '@nestjs/common'

export class RedirectException extends HttpException {
  url = ''

  constructor(err = 'Temporary Redirect', url = '') {
    super(err, HttpStatus.TEMPORARY_REDIRECT)
    this.url = url
  }
}
