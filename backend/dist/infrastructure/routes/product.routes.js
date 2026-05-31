"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PostgresProductRepository_1 = require("../repositories/PostgresProductRepository");
const ProductUseCases_1 = require("../../application/use-cases/products/ProductUseCases");
const ProductController_1 = require("../controllers/ProductController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const multer_1 = require("../config/multer");
const router = (0, express_1.Router)();
const productRepository = new PostgresProductRepository_1.PostgresProductRepository();
const productUseCases = new ProductUseCases_1.ProductUseCases(productRepository);
const productController = new ProductController_1.ProductController(productUseCases);
router.get('/', (req, res, next) => productController.getAll(req, res, next));
router.get('/:id', (req, res, next) => productController.getById(req, res, next));
// Dashboard/Intranet - Protected Routes for Admin
router.post('/', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorizeRole)('admin'), multer_1.upload.single('image'), (req, res, next) => productController.create(req, res, next));
router.put('/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorizeRole)('admin'), multer_1.upload.single('image'), (req, res, next) => productController.update(req, res, next));
router.delete('/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorizeRole)('admin'), (req, res, next) => productController.delete(req, res, next));
exports.default = router;
