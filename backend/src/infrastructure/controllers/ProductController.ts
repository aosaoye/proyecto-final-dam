import { Request, Response, NextFunction } from 'express';
import { ProductUseCases } from '../../application/use-cases/products/ProductUseCases';

export class ProductController {
  constructor(private productUseCases: ProductUseCases) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await this.productUseCases.getAll();
      res.json(products);
    } catch (error: any) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.productUseCases.getById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Not found' });
      res.json(product);
    } catch (error: any) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const productData = req.body;
      if (req.file) {
        productData.image = `/uploads/${req.file.filename}`;
      }
      const product = await this.productUseCases.create(productData);
      res.status(201).json(product);
    } catch (error: any) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updateData = req.body;
      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }
      const product = await this.productUseCases.update(req.params.id, updateData);
      if (!product) return res.status(404).json({ message: 'Not found' });
      res.json(product);
    } catch (error: any) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.productUseCases.delete(req.params.id);
      res.sendStatus(204);
    } catch (error: any) {
      next(error);
    }
  }
}
