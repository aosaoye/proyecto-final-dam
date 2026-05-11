import { UserRepository } from '../../../domain/repositories/UserRepository';
import bcrypt from 'bcryptjs';

export class ResetPassword {
  constructor(private userRepository: UserRepository) {}

  /**
   * Complete the reset by verifying the short-lived token/code 
   */
  async execute(token: string, newPasswordPlain: string): Promise<boolean> {
    // 1. Find by token
    const user = await this.userRepository.findByResetToken(token);
    
    if (!user || !user.resetPasswordExpires) {
      throw new Error('Código de seguridad inválido o expirado.');
    }

    // 2. Check Expiry
    if (user.resetPasswordExpires.getTime() < Date.now()) {
      throw new Error('El código ha caducado. Por favor, solicita uno nuevo.');
    }

    // 3. Proceed to hash and commit
    const hashed = await bcrypt.hash(newPasswordPlain, 10);
    const success = await this.userRepository.updatePassword(user.email, hashed);
    return success;
  }
}
