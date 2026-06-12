import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { pool } from '../config/db';

export class PostgresUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 LIMIT 1',
      [email]
    );
    if (result.rows.length === 0) return null;
    return this.mapToEntity(result.rows[0]);
  }

  async findById(id: string): Promise<User | null> {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) return null;

    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 LIMIT 1',
      [id]
    );
    if (result.rows.length === 0) return null;
    return this.mapToEntity(result.rows[0]);
  }

  async save(user: User): Promise<User> {
    // Using UPSERT simulation for relational DB save pattern
    if (user.id) {
      // Update
      const result = await pool.query(
        `UPDATE users 
         SET name = $1, email = $2, role = $3, password = $4 
         WHERE id = $5 
         RETURNING *`,
        [user.name, user.email, user.role || 'customer', user.password, user.id]
      );
      return this.mapToEntity(result.rows[0]);
    } else {
      // Insert new — password may be NULL for OAuth users
      const result = await pool.query(
        `INSERT INTO users (name, email, role, password) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [user.name, user.email, user.role || 'user', user.password ?? null]
      );
      return this.mapToEntity(result.rows[0]);
    }
  }

  async findAll(): Promise<User[]> {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows.map((row: any) => this.mapToEntity(row));
  }

  async updatePassword(email: string, passwordHash: string): Promise<boolean> {
    const result = await pool.query(
      'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE email = $2',
      [passwordHash, email]
    );
    return (result.rowCount !== null && result.rowCount > 0);
  }

  async saveResetToken(email: string, token: string, expires: Date): Promise<void> {
    await pool.query(
      'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3',
      [token, expires, email]
    );
  }

  async findByResetToken(token: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW() LIMIT 1',
      [token]
    );
    if (result.rows.length === 0) return null;
    return this.mapToEntity(result.rows[0]);
  }

  private mapToEntity(row: any): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      role: row.role as 'admin' | 'user',
      createdAt: row.created_at,
      resetPasswordToken: row.reset_password_token,
      resetPasswordExpires: row.reset_password_expires
    };
  }
}
