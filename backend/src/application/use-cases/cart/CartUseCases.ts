import { CartRepository } from '../../../domain/repositories/CartRepository';
import { ProductRepository } from '../../../domain/repositories/ProductRepository';
import { Cart, CartItem } from '../../../domain/entities/Cart';

export class CartUseCases {
  constructor(
    private cartRepository: CartRepository,
    private productRepository: ProductRepository
  ) {}

  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = { userId, items: [], totalAmount: 0, totalPrice: 0 };
    }
    return cart;
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<Cart> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new Error('Product not found');

    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = { userId, items: [], totalAmount: 0, totalPrice: 0 };
    }

    const existingItem = cart.items.find(i => i.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price: product.price });
    }

    cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return this.cartRepository.save(cart);
  }

  async removeFromCart(userId: string, productId: string): Promise<Cart> {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) throw new Error('Cart not found');

    cart.items = cart.items.filter(i => i.productId !== productId);
    cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return this.cartRepository.save(cart);
  }

  async clearCart(userId: string): Promise<Cart> {
    const emptyCart: Cart = { userId, items: [], totalAmount: 0, totalPrice: 0 };
    return this.cartRepository.save(emptyCart);
  }
}
