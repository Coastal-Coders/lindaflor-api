import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from 'src/modules/mailer/mailer.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenStrategy, AccessTokenStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
