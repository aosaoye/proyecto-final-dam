import { Router } from 'express';
import { PostgresOrderRepository } from '../repositories/PostgresOrderRepository';
import { PostgresCartRepository } from '../repositories/PostgresCartRepository';
import { PostgresProductRepository } from '../repositories/PostgresProductRepository';
import { OrderUseCases } from '../../application/use-cases/order/OrderUseCases';
import { OrderController } from '../controllers/OrderController';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

const orderRepo = new PostgresOrderRepository();
const cartRepo = new PostgresCartRepository();
const prodRepo = new PostgresProductRepository();

const useCases = new OrderUseCases(orderRepo, cartRepo, prodRepo);
const controller = new OrderController(useCases);

router.use(authenticateJWT);

router.post('/', (req: any, res, next) => controller.createOrder(req, res, next));
router.get('/', (req: any, res, next) => controller.getAllOrders(req, res, next));
router.get('/my', (req: any, res, next) => controller.getMyOrders(req, res, next));

export default router;
