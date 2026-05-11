import { ProductRepository } from '../../../domain/repositories/ProductRepository';
import { Product } from '../../../domain/entities/Product';

export class ProductUseCases {
  constructor(private productRepository: ProductRepository) {}

  async getAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async create(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    return this.productRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}
