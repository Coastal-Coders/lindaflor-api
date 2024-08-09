import { IsNotEmpty, IsString } from 'class-validator';

export class createProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // FIXME: Change to number
  @IsString()
  @IsNotEmpty()
  price: string;

  // FIXME: Change to array
  @IsString()
  @IsNotEmpty()
  size: string;

  // FIXME: Change to array
  @IsString()
  @IsNotEmpty()
  color: string;

  // FIXME: Change to number
  @IsString()
  @IsNotEmpty()
  stock: string;

  @IsNotEmpty()
  image: Express.Multer.File[];
}
