import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import type { FindUserDTO, UpdateUserDTO } from './dto';
import type { GetUserPermissionsDTO } from './dto/get-user-permissions.dto';
import type { User } from './types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<FindUserDTO[]> {
    const findAll = await this.prisma.user.findMany();

    if (findAll.length === 0) throw new NotFoundException();

    return findAll.map((user) => ({
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      name: user.name,
      surname: user.surname,
      email: user.email,
    }));
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

  // TODO: Ensure there's a way to create users directly if needed.
  async createUser() {}

  async updateUser(userId: string, data: UpdateUserDTO) {
    // TODO: Ensure user can only update their own data, and only admin can update all users.
    // FIXME: Throw error if try to update a field that is not allowed to be updated in UpdateUserDto.
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException();

    return this.prisma.user.update({
      where: { id: userId },
      data: { ...data },
    });
  }

  // FIXME: User that have a product registered cannot be deleted.
  async deleteUser(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException();

    await this.prisma.user.delete({
      where: { id: userId },
    });
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

  // FIXME: 400 Bad Request
  async changePassword(userId: string, newHash: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException();

    const hash = await this.hashData(newHash);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        hash,
      },
    });
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
    return bcrypt.hashSync(data, 10);
  }
}
