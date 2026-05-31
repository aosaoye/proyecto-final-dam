"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartUseCases = void 0;
class CartUseCases {
    cartRepository;
    productRepository;
    constructor(cartRepository, productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }
    async getCart(userId) {
        let cart = await this.cartRepository.findByUserId(userId);
        if (!cart) {
            cart = { userId, items: [], totalAmount: 0, totalPrice: 0 };
        }
        return cart;
    }
    async addToCart(userId, productId, quantity) {
        const product = await this.productRepository.findById(productId);
        if (!product)
            throw new Error('Product not found');
        let cart = await this.cartRepository.findByUserId(userId);
        if (!cart) {
            cart = { userId, items: [], totalAmount: 0, totalPrice: 0 };
        }
        const existingItem = cart.items.find(i => i.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            cart.items.push({ productId, quantity, price: product.price });
        }
        cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return this.cartRepository.save(cart);
    }
    async removeFromCart(userId, productId) {
        let cart = await this.cartRepository.findByUserId(userId);
        if (!cart)
            throw new Error('Cart not found');
        cart.items = cart.items.filter(i => i.productId !== productId);
        cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return this.cartRepository.save(cart);
    }
    async clearCart(userId) {
        const emptyCart = { userId, items: [], totalAmount: 0, totalPrice: 0 };
        return this.cartRepository.save(emptyCart);
    }
}
exports.CartUseCases = CartUseCases;
