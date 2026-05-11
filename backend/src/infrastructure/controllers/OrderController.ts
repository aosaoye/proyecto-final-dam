import { Response, NextFunction } from 'express';
import { OrderUseCases } from '../../application/use-cases/order/OrderUseCases';
import { AuthRequest } from '../middleware/auth.middleware';
import * as fs from 'fs';
import * as path from 'path';

const logPath = path.join(__dirname, '../../../order_debug.log');
const debugLog = (msg: string) => {
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
};

export class OrderController {
  constructor(private orderUseCases: OrderUseCases) {}

  async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      debugLog(`CREATE ORDER ATTEMPT for User: ${req.user?.id}`);
      const order = await this.orderUseCases.createOrderFromCart(req.user.id);
      debugLog(`CREATE SUCCESS! Order ID: ${order.id}`);
      res.status(201).json(order);
    } catch (error: any) {
      debugLog(`CREATE FAILED: ${error.message}`);
      next(error);
    }
  }

  async getAllOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      debugLog(`GET ALL ORDERS TRIGGERED by user ${req.user?.id}`);
      const orders = await this.orderUseCases.getAllOrders();
      debugLog(`FETCHED ${orders.length} orders from DB.`);
      res.json(orders);
    } catch (error: any) {
      debugLog(`FETCH ALL FAILED: ${error.message}`);
      next(error);
    }
  }

  async getMyOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orders = await this.orderUseCases.getUserOrders(req.user.id);
      res.json(orders);
    } catch (error: any) {
      next(error);
    }
  }
}
