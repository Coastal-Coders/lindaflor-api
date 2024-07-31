import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserRoles, type User } from '@prisma/client';
import { GetCurrentUserId, Roles } from 'src/common/decorators';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/common/guards';
import type { ChangePasswordDTO, FindUserDTO } from './dto';
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

  // @Post()
  // @UseGuards(AccessTokenGuard)
  // @Roles(UserRoles.ADMIN)
  // async createUser(@Body() createUserDto: SignUpDTO): Promise<FindUserDTO> {
  //   return this.userService.createUser(createUserDto);
  // }

  @UseGuards(RefreshTokenGuard)
  @Patch(':id')
  async updateUser(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() data: User
  ): Promise<User> {
    return this.userService.updateUser(userId, id, data);
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
