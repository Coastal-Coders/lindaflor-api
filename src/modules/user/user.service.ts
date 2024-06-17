import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './user.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/modules/user/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<User> {
    const checkUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (checkUser) {
      throw new Error('This email is already in use');
    }

    try {
      return this.prisma.user.create({ data });
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string): Promise<User> {
    const checkUser = await this.prisma.user.findUnique({ where: { id } });

    if (!checkUser) {
      throw new NotFoundException('User not found');
    }
    return checkUser;
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<User> {
    const checkUser = await this.prisma.user.findUnique({ where: { id } });

    if (!checkUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: user,
    });
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const checkUser = await this.prisma.user.findUnique({ where: { id } });

    if (!checkUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.prisma.user.delete({ where: { id } });
  }
}
