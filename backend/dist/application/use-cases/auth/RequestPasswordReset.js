"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestPasswordReset = void 0;
class RequestPasswordReset {
    userRepository;
    emailService;
    constructor(userRepository, emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    async execute(email) {
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
exports.RequestPasswordReset = RequestPasswordReset;
