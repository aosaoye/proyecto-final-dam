import { User } from '../entities/User';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  updatePassword(email: string, passwordHash: string): Promise<boolean>;
  saveResetToken(email: string, token: string, expires: Date): Promise<void>;
  findByResetToken(token: string): Promise<User | null>;
}
