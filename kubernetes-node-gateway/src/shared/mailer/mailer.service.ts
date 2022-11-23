import { ERROR } from '@/common/constants/error'
import { Logger } from '@/common/utils/logger'
import { throwError } from '@/common/utils/throw-error'
import { tryCatch } from '@/common/utils/try-catch'
import { IMailerConfig } from '@/shared/mailer/mailer.interface'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import nodemailer, { Transporter } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'

@Injectable()
export class MailerService {
  private transporter: Transporter
  constructor(private readonly configService: ConfigService, private readonly logger: Logger) {
    const mailerConfig = configService.get<IMailerConfig>('mailer')
    if (!mailerConfig) {
      throwError(ERROR.SYSTEM_ERROR.MAILER.INIT_ERROR, 'mailer config not found')
    }

    this.transporter = nodemailer.createTransport({
      host: mailerConfig.server,
      port: Number(mailerConfig.port),
    })
    this.logger.setContext(MailerService.name)
  }

  public async sendMail(options: Omit<Mail.Options, 'from'>): Promise<void> {
    const [_, error] = await tryCatch(
      this.transporter.sendMail({
        ...options,
        from: this.configService.get<string>('mailer.from'),
      }),
    )

    if (error) {
      this.logger.error(`send mail error: ${error.message}`)
    } else {
      this.logger.log(`send mail success: to: ${options.to}, subject: ${options.subject}`)
    }
  }
}
