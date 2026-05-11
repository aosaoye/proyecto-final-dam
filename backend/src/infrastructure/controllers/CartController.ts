import { Response, NextFunction } from 'express';
import { CartUseCases } from '../../application/use-cases/cart/CartUseCases';
import { AuthRequest } from '../middleware/auth.middleware';

export class CartController {
  constructor(private cartUseCases: CartUseCases) {}

  async getCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cart = await this.cartUseCases.getCart(req.user.id);
      res.json(cart);
    } catch (error: any) {
      next(error);
    }
  }

  async addToCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { productId, quantity } = req.body;
      const cart = await this.cartUseCases.addToCart(req.user.id, productId, quantity);
      res.json(cart);
    } catch (error: any) {
      next(error);
    }
  }

  async removeFromCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const cart = await this.cartUseCases.removeFromCart(req.user.id, productId);
      res.json(cart);
    } catch (error: any) {
      next(error);
    }
  }
}
