import { OrderStatus } from '@prisma/client';

export class createOrderDto {
  readonly id: number;
  readonly totalAmount: number;
  readonly status: OrderStatus;
}
