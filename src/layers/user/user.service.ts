import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './user.model';
import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/layers/user/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: user,
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
