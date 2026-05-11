import { CartRepository } from '../../domain/repositories/CartRepository';
import { Cart } from '../../domain/entities/Cart';
import { CartModel } from '../models/CartModel';

export class MongoCartRepository implements CartRepository {
  async findByUserId(userId: string): Promise<Cart | null> {
    const cart = await CartModel.findOne({ userId }).populate('items.productId');
    if (!cart) return null;
    return {
      id: cart._id.toString(),
      userId: cart.userId.toString(),
      items: cart.items.map((i: any) => ({
        productId: i.productId?._id ? i.productId._id.toString() : i.productId.toString(),
        quantity: i.quantity,
        price: i.price,
        product: i.productId?._id ? i.productId : null // Send object to frontend
      })),
      totalAmount: cart.totalAmount,
      totalPrice: cart.totalAmount // Frontend mapping
    };
  }

  async save(cart: Cart): Promise<Cart> {
    const filter = { userId: cart.userId };
    const update = {
      items: cart.items,
      totalAmount: cart.totalAmount
    };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const saved = await CartModel.findOneAndUpdate(filter, update, options).populate('items.productId');
    return {
      id: saved?._id.toString(),
      userId: saved?.userId.toString() || cart.userId,
      items: saved?.items.map((i: any) => ({
        productId: i.productId?._id ? i.productId._id.toString() : i.productId.toString(),
        quantity: i.quantity,
        price: i.price,
        product: i.productId?._id ? i.productId : null
      })) || [],
      totalAmount: saved?.totalAmount || 0,
      totalPrice: saved?.totalAmount || 0
    };
  }
}
