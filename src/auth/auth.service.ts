import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dtos';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async signupLocal(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

    const newUser = await this.prisma.user
      .create({
        data: {
          email: dto.email,
          hash,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credentials incorrect');
          }
        }
        throw error;
      });

    const tokens = await this.getTokens(newUser.id, dto.email);

    await this.updateRefreshTokenHash(newUser.id, tokens.refreshToken);

    return tokens;
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException('Access denied');

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id, dto.email);

    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    try {
      await this.prisma.user.updateMany({
        where: {
          id: userId,
          hashedRefreshToken: { not: null },
        },
        data: { hashedRefreshToken: null },
      });
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.hashedRefreshToken) throw new ForbiddenException('Access denied');

      const refreshTokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);

      if (!refreshTokenMatches) throw new ForbiddenException('Access denied');

      const tokens = await this.getTokens(user.id, user.email);

      await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      console.error('Error during token refresh:', error);
      throw new ForbiddenException('Access denied');
    }
  }

  async hashData(data: string): Promise<string> {
    return bcrypt.hashSync(data, 10);
  }

  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await this.hashData(refreshToken);

    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hash },
    });
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: process.env.ACESSTOKEN_SECRET, expiresIn: '15m' }
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: process.env.REFRESHTOKEN_SECRET, expiresIn: '7h' }
      ),
    ]);
    return { accessToken, refreshToken };
  }
}
