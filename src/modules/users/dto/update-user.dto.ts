import type { UserRoles } from '@prisma/client';
import { IsArray, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDTO {
  @IsNotEmpty()
  name?: string;

  @IsNotEmpty()
  surname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsArray()
  role?: UserRoles[];
}
