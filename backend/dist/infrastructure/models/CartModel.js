"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModel = void 0;
const mongoose_1 = require("mongoose");
const cartItemSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
}, { _id: false });
const cartSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    totalAmount: { type: Number, default: 0 }
}, { timestamps: true });
exports.CartModel = (0, mongoose_1.model)('Cart', cartSchema);
