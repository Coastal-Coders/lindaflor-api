import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRoles, type User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CreateUserDTO, FindUserDTO, GetUserPermissionsDTO, UpdateUserDTO } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<FindUserDTO[]> {
    const findAll = await this.prisma.user.findMany();

    if (findAll.length === 0) throw new NotFoundException();

    const response = findAll.map((user) => ({
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      name: user.name,
      surname: user.surname,
      email: user.email,
    }));

    return response;
  }

  async findOne(userId: string): Promise<FindUserDTO | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException();

    const response: FindUserDTO = {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      name: user.name,
      surname: user.surname,
      email: user.email,
    };

    return response;
  }

  async createUser(dto: CreateUserDTO): Promise<User> {
    const hash = await this.hashData(dto.password);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          name: dto.name,
          surname: dto.surname,
          email: dto.email,
          hash,
          role: dto.role ?? [UserRoles.CUSTOMER],
        },
      });
      return newUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async updateUser(userId: string, data: UpdateUserDTO, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        updatedAt: new Date(),
        name: data.name,
        surname: data.surname,
        email: data.email,
      },
    });

    res.status(200).send({ message: 'User updated' });
  }

  async deleteUser(userId: string, res: Response): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException();

    await this.prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).send({ message: 'User deleted' });
  }

  async getUserPermissions(email: string): Promise<GetUserPermissionsDTO | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) throw new NotFoundException();

    const response: GetUserPermissionsDTO = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return response;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    res: Response
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException();

    const passwordMatches = await bcrypt.compare(currentPassword, user.hash);
    if (!passwordMatches) throw new ForbiddenException('Invalid password');

    const comparePasswords = await bcrypt.compare(newPassword, user.hash);
    if (comparePasswords)
      throw new BadRequestException('New password cannot be the same as the current password');

    const newHash = await this.hashData(newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hash: newHash,
      },
    });

    res.status(200).send({ message: 'Password changed' });
  }

  // TODO: Functionality to change user role.
  async changeUserRole() {
    return null;
  }

  // TODO: Functionality to handle password resets, through email.
  async resetPassword() {
    return null;
  }

  // TODO: Track and list user activities or actions within the system.
  async userActivities() {
    return null;
  }

  async hashData(data: string): Promise<string> {
    if (!data) throw new Error('Password is required for hashing');

    return bcrypt.hashSync(data, 10);
  }
}
