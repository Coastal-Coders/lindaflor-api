import type { Product, UserRoles } from '@prisma/client';

export class User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  surname: string;
  email: string;
  hash: string;
  role: UserRoles[];
  products?: Product[];
}
