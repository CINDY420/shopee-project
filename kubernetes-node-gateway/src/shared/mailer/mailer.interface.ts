export interface ITransporter {
  sendMail: ({
    from,
    to,
    subject,
    text,
    html,
  }: {
    from: string
    to: string
    subject: string
    text?: string
    html?: string
  }) => Promise<void>
}

export interface IMailerConfig {
  server: string
  port: string
}
