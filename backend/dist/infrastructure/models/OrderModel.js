"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
const orderItemSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    productName: { type: String, required: true }
}, { _id: false });
const orderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'completed'
    }
}, { timestamps: true });
exports.OrderModel = (0, mongoose_1.model)('Order', orderSchema);
