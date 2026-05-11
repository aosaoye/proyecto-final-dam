import { Router } from 'express';
import { PostgresCartRepository } from '../repositories/PostgresCartRepository';
import { PostgresProductRepository } from '../repositories/PostgresProductRepository';
import { CartUseCases } from '../../application/use-cases/cart/CartUseCases';
import { CartController } from '../controllers/CartController';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

const cartRepository = new PostgresCartRepository();
const productRepository = new PostgresProductRepository();
const cartUseCases = new CartUseCases(cartRepository, productRepository);
const cartController = new CartController(cartUseCases);

router.use(authenticateJWT); // Protect all cart routes

router.get('/', (req: any, res, next) => cartController.getCart(req, res, next));
router.post('/items', (req: any, res, next) => cartController.addToCart(req, res, next));
router.delete('/items/:productId', (req: any, res, next) => cartController.removeFromCart(req, res, next));

export default router;
