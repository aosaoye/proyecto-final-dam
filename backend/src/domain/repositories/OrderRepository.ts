import { Order } from '../entities/Order';

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findAll(): Promise<Order[]>;
  findByUserId(userId: string): Promise<Order[]>;
}
