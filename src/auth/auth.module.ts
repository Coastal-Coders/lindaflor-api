import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenStrategy, AccessTokenStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
