import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { Product } from '../../domain/entities/Product';
import { ProductModel } from '../models/ProductModel';

export class MongoProductRepository implements ProductRepository {
  async findAll(): Promise<Product[]> {
    const products = await ProductModel.find();
    return products.map(p => this.mapToEntity(p));
  }

  async findById(id: string): Promise<Product | null> {
    const p = await ProductModel.findById(id);
    return p ? this.mapToEntity(p) : null;
  }

  async save(product: Product): Promise<Product> {
    const p = new ProductModel(product);
    await p.save();
    return this.mapToEntity(p);
  }

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    const p = await ProductModel.findByIdAndUpdate(id, product, { new: true });
    return p ? this.mapToEntity(p) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProductModel.findByIdAndDelete(id);
    return !!result;
  }

  private mapToEntity(p: any): Product {
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
