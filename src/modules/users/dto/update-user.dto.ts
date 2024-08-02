import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  surname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
