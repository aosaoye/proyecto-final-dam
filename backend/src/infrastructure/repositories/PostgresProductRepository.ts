import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { pool } from '../config/db';

export class PostgresProductRepository implements ProductRepository {
  async findAll(): Promise<Product[]> {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    return result.rows.map((row: any) => this.mapToEntity(row));
  }

  async findById(id: string): Promise<Product | null> {
    // Simple defensive check: Postgres UUID must follow strict format. 
    // If the frontend passes an old MongoDB ID, we gracefully return null instead of crashing server.
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return null; // Invalid UUID format, safely not found
    }

    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1 LIMIT 1',
      [id]
    );
    if (result.rows.length === 0) return null;
    return this.mapToEntity(result.rows[0]);
  }

  async save(product: Product): Promise<Product> {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, image, category, stock, glb_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        product.name,
        product.description,
        product.price,
        product.image || null,
        product.category,
        product.stock || 10,
        product.glbUrl || null
      ]
    );
    return this.mapToEntity(result.rows[0]);
  }

  async update(id: string, productData: Partial<Product>): Promise<Product | null> {
    // In procedural SQL update you usually construct a dynamic set clause or simple full replace.
    // Let's get existing to maintain data integrity
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated = { ...existing, ...productData };

    const result = await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, image = $4, category = $5, stock = $6, glb_url = $7
       WHERE id = $8 
       RETURNING *`,
      [
        updated.name,
        updated.description,
        updated.price,
        updated.image || null,
        updated.category,
        updated.stock,
        updated.glbUrl || null,
        id
      ]
    );
    
    if (result.rows.length === 0) return null;
    return this.mapToEntity(result.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return (result.rowCount !== null && result.rowCount > 0);
  }

  private mapToEntity(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price), // Postgres numeric often returns string
      image: row.image,
      category: row.category,
      stock: parseInt(row.stock, 10),
      glbUrl: row.glb_url,
      createdAt: row.created_at
    };
  }
}
