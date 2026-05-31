"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    stock: { type: Number, default: 0 },
    category: { type: String, required: true }
}, { timestamps: true });
exports.ProductModel = (0, mongoose_1.model)('Product', productSchema);
