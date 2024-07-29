import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserRoles } from '@prisma/client';
import { Roles } from 'src/common/decorators';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/common/guards';
import type { ChangePasswordDTO, FindUserDTO, UpdateUserDTO } from './dto';
import type { GetUserPermissionsDTO } from './dto/get-user-permissions.dto';
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

  async createUser() {}

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() data: UpdateUserDTO) {
    const user = await this.userService.findOne(id);

    if (!user) throw new NotFoundException();
    return this.userService.updateUser(id, data);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(UserRoles.ADMIN)
  @Get('permissions/:email')
  async getUserPermissions(@Param('email') email: string): Promise<GetUserPermissionsDTO | null> {
    return this.userService.getUserPermissions(email);
  }

  // FIXME
  @UseGuards(AccessTokenGuard)
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDTO
  ): Promise<{ hash: string }> {
    const { hash } = changePasswordDto;
    await this.userService.changePassword(id, hash);
    return { hash };
  }

  async resetPassword() {}

  async userActivities() {}
}
