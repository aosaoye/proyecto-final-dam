import { Cart, CartItem } from '../../domain/entities/Cart';
import { CartRepository } from '../../domain/repositories/CartRepository';
import { pool } from '../config/db';

export class PostgresCartRepository implements CartRepository {
  async findByUserId(userId: string): Promise<Cart | null> {
    // Perform JOIN to fetch complete product info simultaneously for frontend population
    const result = await pool.query(
      `SELECT ci.*, p.name, p.price, p.image, p.description, p.category
       FROM cart_items ci
       LEFT JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [userId]
    );

    // Map SQL rows to items array
    const items: CartItem[] = result.rows.map((row: any) => ({
      productId: row.product_id,
      quantity: parseInt(row.quantity, 10),
      price: parseFloat(row.price || '0'),
      product: row.name ? {
        id: row.product_id,
        name: row.name,
        price: parseFloat(row.price),
        image: row.image,
        description: row.description,
        category: row.category
      } : undefined
    }));

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
      userId,
      items,
      totalAmount: total,
      totalPrice: total // Support dual view frontend contract compatibility
    };
  }

  async save(cart: Cart): Promise<Cart> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Clear existing user basket to rebuild securely
      await client.query(
        'DELETE FROM cart_items WHERE user_id = $1',
        [cart.userId]
      );

      // 2. Bulk insert updated inventory if any exists
      if (cart.items && cart.items.length > 0) {
        for (const item of cart.items) {
          await client.query(
            'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)',
            [cart.userId, item.productId, item.quantity]
          );
        }
      }

      await client.query('COMMIT');
      
      // Refresh to ensure latest consistent state after overwrite
      return this.findByUserId(cart.userId) as Promise<Cart>;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
