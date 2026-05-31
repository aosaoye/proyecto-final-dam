"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderUseCases = void 0;
class OrderUseCases {
    orderRepository;
    cartRepository;
    productRepository;
    constructor(orderRepository, cartRepository, productRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }
    async createOrderFromCart(userId) {
        const cart = await this.cartRepository.findByUserId(userId);
        if (!cart || cart.items.length === 0) {
            throw new Error('El carrito está vacío.');
        }
        const orderItems = [];
        for (const cartItem of cart.items) {
            const product = await this.productRepository.findById(cartItem.productId);
            if (!product)
                throw new Error(`Producto no encontrado: ${cartItem.productId}`);
            orderItems.push({
                productId: cartItem.productId,
                quantity: cartItem.quantity,
                price: product.price,
                productName: product.name
            });
        }
        const order = {
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
    async getAllOrders() {
        return this.orderRepository.findAll();
    }
    async getUserOrders(userId) {
        return this.orderRepository.findByUserId(userId);
    }
}
exports.OrderUseCases = OrderUseCases;
