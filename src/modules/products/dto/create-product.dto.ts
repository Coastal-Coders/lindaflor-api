import type { Colors, Sizes } from '@prisma/client';
import { Express } from 'express';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsArray()
  @IsNotEmpty()
  size: Sizes[];

  @IsArray()
  @IsNotEmpty()
  color: Colors[];

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsNotEmpty()
  image: Express.Multer.File[];
}
