"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoProductRepository = void 0;
const ProductModel_1 = require("../models/ProductModel");
class MongoProductRepository {
    async findAll() {
        const products = await ProductModel_1.ProductModel.find();
        return products.map(p => this.mapToEntity(p));
    }
    async findById(id) {
        const p = await ProductModel_1.ProductModel.findById(id);
        return p ? this.mapToEntity(p) : null;
    }
    async save(product) {
        const p = new ProductModel_1.ProductModel(product);
        await p.save();
        return this.mapToEntity(p);
    }
    async update(id, product) {
        const p = await ProductModel_1.ProductModel.findByIdAndUpdate(id, product, { new: true });
        return p ? this.mapToEntity(p) : null;
    }
    async delete(id) {
        const result = await ProductModel_1.ProductModel.findByIdAndDelete(id);
        return !!result;
    }
    mapToEntity(p) {
        return {
            id: p._id.toString(),
            name: p.name,
            description: p.description,
            price: p.price,
            image: p.image,
            stock: p.stock,
            category: p.category,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt
        };
    }
}
exports.MongoProductRepository = MongoProductRepository;
