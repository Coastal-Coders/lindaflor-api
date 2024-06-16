import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './user.model';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/layers/user/user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user: ${JSON.stringify(data)}`);

    try {
      return this.prisma.user.create({ data });
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async getAllUsers(): Promise<User[]> {
    this.logger.log(`Getting all users`);

    return this.prisma.user.findMany();
  }

  async getUserById(id: string): Promise<User> {
    this.logger.log(`Getting user by id: ${id}`);
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user by id: ${id}`);
    const checkUser = await this.prisma.user.findUnique({ where: { id } });
    if (!checkUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: user,
    });
  }

  async deleteUser(id: string): Promise<void> {
    this.logger.log(`Deleting user by id: ${id}`);
    try {
      await this.prisma.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
