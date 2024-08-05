import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    NestMailerModule.forRoot({
      transport: {
        host: 'localhost',
        port: 1025,
        ignoreTLS: true,
        secure: false,
        auth: {
          user: process.env.MAIL_DEV_INCOMING_USER,
          pass: process.env.MAIL_DEV_INCOMING_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <lindaflor@gmail.com>',
      },
      preview: true,
      template: {
        dir: './src/modules/mailer/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
