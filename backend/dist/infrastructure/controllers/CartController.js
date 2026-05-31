"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
class CartController {
    cartUseCases;
    constructor(cartUseCases) {
        this.cartUseCases = cartUseCases;
    }
    async getCart(req, res, next) {
        try {
            const cart = await this.cartUseCases.getCart(req.user.id);
            res.json(cart);
        }
        catch (error) {
            next(error);
        }
    }
    async addToCart(req, res, next) {
        try {
            const { productId, quantity } = req.body;
            const cart = await this.cartUseCases.addToCart(req.user.id, productId, quantity);
            res.json(cart);
        }
        catch (error) {
            next(error);
        }
    }
    async removeFromCart(req, res, next) {
        try {
            const { productId } = req.params;
            const cart = await this.cartUseCases.removeFromCart(req.user.id, productId);
            res.json(cart);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CartController = CartController;
