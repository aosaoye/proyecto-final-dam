import { UserRepository } from '../../../domain/repositories/UserRepository';
import { EmailService } from '../../../infrastructure/services/EmailService';
import crypto from 'crypto';

export class RequestPasswordReset {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Pour security best practices, don't leak email existence, but we throw error for UX here
      throw new Error('No hay cuenta asociada a ese correo electrónico.');
    }

    // 1. Generate a 6-digit numeric code for easiest UI demo interaction
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 2. Valid for 15 minutes
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await this.userRepository.saveResetToken(email, resetCode, expires);

    // 3. Attempt real email delivery
    const sent = await this.emailService.sendResetCode(email, resetCode);

    // 4. Fallback: Always log to console just in case
    console.log('\n===================================================');
    console.log('📬  [EMAIL DISPATCH MONITOR]');
    console.log(`STATUS: ${sent ? '✅ REAL EMAIL SENT' : '❌ FAILED TO SEND REAL EMAIL'}`);
    console.log(`TO: ${email}`);
    console.log(`CODE: ${resetCode}`);
    console.log('===================================================\n');
  }
}
