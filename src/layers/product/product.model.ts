import { ProductSize } from '@prisma/client';

export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  size: ProductSize;
  color: string;
  stock: number;
}
