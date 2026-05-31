"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
class ProductController {
    productUseCases;
    constructor(productUseCases) {
        this.productUseCases = productUseCases;
    }
    async getAll(req, res, next) {
        try {
            const products = await this.productUseCases.getAll();
            res.json(products);
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const product = await this.productUseCases.getById(req.params.id);
            if (!product)
                return res.status(404).json({ message: 'Not found' });
            res.json(product);
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const productData = req.body;
            if (req.file) {
                productData.image = `/uploads/${req.file.filename}`;
            }
            const product = await this.productUseCases.create(productData);
            res.status(201).json(product);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const updateData = req.body;
            if (req.file) {
                updateData.image = `/uploads/${req.file.filename}`;
            }
            const product = await this.productUseCases.update(req.params.id, updateData);
            if (!product)
                return res.status(404).json({ message: 'Not found' });
            res.json(product);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await this.productUseCases.delete(req.params.id);
            res.sendStatus(204);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;
