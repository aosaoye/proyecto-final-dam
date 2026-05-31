"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoCartRepository = void 0;
const CartModel_1 = require("../models/CartModel");
class MongoCartRepository {
    async findByUserId(userId) {
        const cart = await CartModel_1.CartModel.findOne({ userId }).populate('items.productId');
        if (!cart)
            return null;
        return {
            id: cart._id.toString(),
            userId: cart.userId.toString(),
            items: cart.items.map((i) => ({
                productId: i.productId?._id ? i.productId._id.toString() : i.productId.toString(),
                quantity: i.quantity,
                price: i.price,
                product: i.productId?._id ? i.productId : null // Send object to frontend
            })),
            totalAmount: cart.totalAmount,
            totalPrice: cart.totalAmount // Frontend mapping
        };
    }
    async save(cart) {
        const filter = { userId: cart.userId };
        const update = {
            items: cart.items,
            totalAmount: cart.totalAmount
        };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const saved = await CartModel_1.CartModel.findOneAndUpdate(filter, update, options).populate('items.productId');
        return {
            id: saved?._id.toString(),
            userId: saved?.userId.toString() || cart.userId,
            items: saved?.items.map((i) => ({
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
exports.MongoCartRepository = MongoCartRepository;
