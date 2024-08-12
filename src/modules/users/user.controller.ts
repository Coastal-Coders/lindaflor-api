// prettier-ignore
import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { type User, UserRoles } from '@prisma/client';
import type { Response } from 'express';
import { GetCurrentUserId, Roles } from 'src/common/decorators';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/common/guards';
import type { FindUserDTO, GetUserPermissionsDTO } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RefreshTokenGuard)
  @Roles(UserRoles.ADMIN)
  @Get()
  async findAll(): Promise<FindUserDTO[] | null> {
    return this.userService.findAll();
  }

  @UseGuards(RefreshTokenGuard)
  @Roles(UserRoles.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FindUserDTO | null> {
    return this.userService.findOne(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() // FIXME
    dto: {
      name: string;
      surname: string;
      email: string;
      password: string;
      role?: UserRoles[];
    }
  ): Promise<User> {
    const user = await this.userService.createUser({ ...dto });
    return user;
  }

  @UseGuards(RefreshTokenGuard)
  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateUser(@GetCurrentUserId() userId: string, @Body() data: User, @Res() res: Response) {
    return this.userService.updateUser(userId, data, res);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response): Promise<void> {
    return this.userService.deleteUser(id, res);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(UserRoles.ADMIN)
  @Get('permissions/:email')
  async getUserPermissions(@Param('email') email: string): Promise<GetUserPermissionsDTO | null> {
    return this.userService.getUserPermissions(email);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('change-password/')
  async changePassword(
    @GetCurrentUserId() userId: string,
    // FIXME
    @Body() data: { currentPassword: string; newPassword: string },
    @Res() res: Response
  ): Promise<void> {
    const { currentPassword, newPassword } = data;
    if (!currentPassword || !newPassword) throw new BadRequestException('Passwords are required');

    await this.userService.changePassword(userId, currentPassword, newPassword, res);
  }

  async changeUserRole() {}

  async resetPassword() {}

  async userActivities() {}
}
