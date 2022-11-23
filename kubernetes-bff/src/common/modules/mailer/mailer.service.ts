import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IMailerConfig } from 'common/interfaces'
import { Logger } from 'common/helpers/logger'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')

interface ITransporter {
  sendMail: ({
    from,
    to,
    subject,
    text,
    html
  }: {
    from: string
    to: string
    subject: string
    text?: string
    html?: string
  }) => Promise<void>
}

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name)
  private readonly transporter: ITransporter

  constructor(private configService: ConfigService) {
    const mailerConfig = configService.get<IMailerConfig>('mailer')
    this.transporter = nodemailer.createTransport({
      host: mailerConfig.server,
      port: mailerConfig.port
    })
  }

  async sendMail({
    subject,
    to,
    text,
    html
  }: {
    subject: string
    to: string
    text?: string
    html?: string
  }): Promise<void> {
    await this.transporter.sendMail({
      from: 'kubernetes@shopee.com',
      to,
      text,
      html,
      subject
    })
    this.logger.log(`user sent email to ${to}, subject: ${subject}`)
  }
}
