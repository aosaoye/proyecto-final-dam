import { User } from '../../../domain/entities/User';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import bcrypt from 'bcryptjs';

export class RegisterUser {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: User): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const allUsers = await this.userRepository.findAll();
    // Si es el primer usuario del sistema, hacerlo administrador automáticamente
    const role = allUsers.length === 0 ? 'admin' : (userData.role || 'user');

    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    
    const newUser: User = {
      ...userData,
      password: hashedPassword,
      role: role as any
    };

    return this.userRepository.save(newUser);
  }
}
