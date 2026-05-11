import { OrderRepository } from '../../../domain/repositories/OrderRepository';
import { CartRepository } from '../../../domain/repositories/CartRepository';
import { ProductRepository } from '../../../domain/repositories/ProductRepository';
import { Order, OrderItem } from '../../../domain/entities/Order';

export class OrderUseCases {
  constructor(
    private orderRepository: OrderRepository,
    private cartRepository: CartRepository,
    private productRepository: ProductRepository
  ) {}

  async createOrderFromCart(userId: string): Promise<Order> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new Error('El carrito está vacío.');
    }

    const orderItems: OrderItem[] = [];
    
    for (const cartItem of cart.items) {
        const product = await this.productRepository.findById(cartItem.productId);
        if (!product) throw new Error(`Producto no encontrado: ${cartItem.productId}`);
        
        orderItems.push({
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: product.price,
            productName: product.name
        });
    }

    const order: Order = {
        userId,
        items: orderItems,
        totalAmount: cart.totalAmount,
        status: 'completed',
        createdAt: new Date()
    };

    const savedOrder = await this.orderRepository.create(order);

    // Clear cart now that order is safely persisted
    await this.cartRepository.save({
        userId,
        items: [],
        totalAmount: 0
    });

    return savedOrder;
  }

  async getAllOrders(): Promise<Order[]> {
      return this.orderRepository.findAll();
  }

  async getUserOrders(userId: string): Promise<Order[]> {
      return this.orderRepository.findByUserId(userId);
  }
}
