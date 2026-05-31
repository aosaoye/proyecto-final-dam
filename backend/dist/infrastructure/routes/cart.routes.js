"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PostgresCartRepository_1 = require("../repositories/PostgresCartRepository");
const PostgresProductRepository_1 = require("../repositories/PostgresProductRepository");
const CartUseCases_1 = require("../../application/use-cases/cart/CartUseCases");
const CartController_1 = require("../controllers/CartController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const cartRepository = new PostgresCartRepository_1.PostgresCartRepository();
const productRepository = new PostgresProductRepository_1.PostgresProductRepository();
const cartUseCases = new CartUseCases_1.CartUseCases(cartRepository, productRepository);
const cartController = new CartController_1.CartController(cartUseCases);
router.use(auth_middleware_1.authenticateJWT); // Protect all cart routes
router.get('/', (req, res, next) => cartController.getCart(req, res, next));
router.post('/items', (req, res, next) => cartController.addToCart(req, res, next));
router.delete('/items/:productId', (req, res, next) => cartController.removeFromCart(req, res, next));
exports.default = router;
