"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductUseCases = void 0;
class ProductUseCases {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async getAll() {
        return this.productRepository.findAll();
    }
    async getById(id) {
        return this.productRepository.findById(id);
    }
    async create(product) {
        return this.productRepository.save(product);
    }
    async update(id, data) {
        return this.productRepository.update(id, data);
    }
    async delete(id) {
        return this.productRepository.delete(id);
    }
}
exports.ProductUseCases = ProductUseCases;
