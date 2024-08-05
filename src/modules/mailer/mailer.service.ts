import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) {}

  // TODO: SMTP configuration & test email recovery
  async sendPasswordRecoveryEmail(email: string, token: string): Promise<void> {
    console.log(`Sending password recovery email to ${email} with token: ${token}`);
    const url = `http://localhost:3000/auth/password-reset/reset?token=${token}`;
    console.log(url);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Lindaflor - Password Recovery',
      template: './password-recovery',
      context: {
        url,
      },
    });
  }
}
