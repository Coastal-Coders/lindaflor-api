import type { UserRoles } from '@prisma/client';

export class GetUserPermissionsDTO {
  id: string;
  email: string;
  role: UserRoles[];
}
