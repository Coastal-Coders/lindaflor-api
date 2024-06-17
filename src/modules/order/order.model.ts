import { OrderStatus } from '@prisma/client';

export class Order {
  id: string;
  totalAmount: number;
  status: OrderStatus;
}
