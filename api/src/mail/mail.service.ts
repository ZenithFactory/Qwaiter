import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, text: string) {
    await this.mailerService.sendMail({
      to,
      subject,
      text,
    });
  }

  async sendVerificationCodeMail(to: string, code: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Qwaiter - send verification code.',
      text: `Your verification code: ${code}`,
    });
  }
}
