import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import type { FindUserDTO, UpdateUserDTO } from './dto';
import type { GetUserPermissionsDTO } from './dto/get-user-permissions.dto';

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

  // TODO: Ensure there's a way to create users directly if needed.
  // FIXME: Error: getaddrinfo ENOTFOUND create
  // async createUser(createUserDto: SignUpDTO): Promise<FindUserDTO> {
  //   const { name, surname, email, password } = createUserDto;

  //   const hash = await this.hashData(password);

  //   const newUser = await this.prisma.user.create({
  //     data: {
  //       name,
  //       surname,
  //       email,
  //       hash,
  //     },
  //   });

  //   return {
  //     id: newUser.id,
  //     createdAt: newUser.createdAt,
  //     updatedAt: newUser.updatedAt,
  //     name: newUser.name,
  //     surname: newUser.surname,
  //     email: newUser.email,
  //   };
  // }

  async updateUser(userId: string, id: string, data: UpdateUserDTO): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) throw new NotFoundException();
    if (userId !== id) throw new ForbiddenException('You cannot update another user');

    const updatedUser = await this.prisma.user.update({
      where: { id: id },
      data: {
        updatedAt: new Date(),
        name: data.name,
        surname: data.surname,
        email: data.email,
      },
    });

    return updatedUser;
  }

  // FIXME: User that have a product registered cannot be deleted.
  // Invalid `prisma.user.delete()` invocation:
  // The change you are trying to make would violate the required relation 'ProductToUser' between the `Product` and `User` models.
  // PrismaClientKnownRequestError:
  // Invalid `prisma.user.delete()` invocation:
  // The change you are trying to make would violate the required relation 'ProductToUser' between the `Product` and `User` models.
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
    console.log('Changing password user with ID:', userId);
    console.log('Password is being hashed ?:', newHash);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException();

    const hash = await this.hashData(newHash);
    console.log('hash function:', hash);

    const updatedUser = this.prisma.user.update({
      where: { id: userId },
      data: {
        hash,
      },
      include: {
        Product: true,
      },
    });

    console.log('User updated: ', updatedUser);
    return updatedUser;
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
