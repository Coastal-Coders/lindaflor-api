import { ProductSize } from '@prisma/client';

export class createProductDto {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly size: ProductSize;
  readonly color: string;
  readonly stock: number;
}

export class updateProductDto {
  readonly name?: string;
  readonly description?: string;
  readonly price?: number;
  readonly size?: ProductSize;
  readonly color?: string;
  readonly stock?: number;
}
