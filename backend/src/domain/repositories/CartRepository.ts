import { Cart } from '../entities/Cart';

export interface CartRepository {
  findByUserId(userId: string): Promise<Cart | null>;
  save(cart: Cart): Promise<Cart>;
}
