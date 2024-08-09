import { IsOptional, IsString } from 'class-validator';

export class updateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  // FIXME: Change to number
  // @IsOptional()
  // @IsNumber()
  // price?: number;
  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;

  // FIXME: Change to number
  // @IsOptional()
  // @IsNumber()
  // stock?: number;
  @IsOptional()
  @IsString()
  stock?: string;
}
