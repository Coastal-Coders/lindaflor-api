import { Prisma, UserRoles } from '@prisma/client';

export class User implements Prisma.UserCreateInput {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRoles;
}
