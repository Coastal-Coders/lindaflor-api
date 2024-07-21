import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDTO, SignUpDTO } from './dto';
import { JwtPayload, Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async signUpLocal(dto: SignUpDTO): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          name: dto.name,
          surname: dto.surname,
          email: dto.email,
          hash,
          role: dto.role || [UserRoles.CUSTOMER],
        },
      });

      const tokens = await this.createTokens(newUser.id, dto.email, newUser.role);
      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async signInLocal(dto: SignInDTO, res: Response): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException('Invalid credentials');

    const tokens = await this.createTokens(user.id, dto.email, user.role);

    this.setCookies(res, tokens);

    res.status(200).send({ message: 'Login successful' });
  }

  async logOut(_userId: string, res: Response): Promise<void> {
    try {
      this.clearCookies(res);

      res.status(200).send({ message: 'Logout successful' });
    } catch (error) {
      throw new InternalServerErrorException('Error logging out');
    }
  }

  async hashData(data: string): Promise<string> {
    return bcrypt.hashSync(data, 10);
  }

  async refreshTokens(userId: string, refreshToken: string, res: Response): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new ForbiddenException('User not found');

      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESHTOKEN_SECRET,
      });

      if (user.id !== payload.sub) throw new ForbiddenException('Invalid token');

      const tokens = await this.createTokens(user.id, user.email, user.role);

      this.setCookies(res, tokens);

      res.send({ message: 'Tokens refreshed' });
    } catch (error) {
      throw new ForbiddenException('Error refreshing tokens');
    }
  }

  async createTokens(userId: string, email: string, rolesId: UserRoles[]): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
      roles: rolesId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESSTOKEN_SECRET,
        expiresIn: '1hr',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESHTOKEN_SECRET,
        expiresIn: '1d',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private setCookies(res: Response, tokens: Tokens): void {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });
  }

  private clearCookies(res: Response): void {
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(0),
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
  }
}
