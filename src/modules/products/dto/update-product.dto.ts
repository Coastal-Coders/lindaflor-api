import type { Colors, Sizes } from '@prisma/client';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class updateProductDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsArray()
  size?: Sizes[];

  @IsOptional()
  @IsArray()
  color?: Colors[];

  @IsOptional()
  @IsNumber()
  stock?: number;
}
