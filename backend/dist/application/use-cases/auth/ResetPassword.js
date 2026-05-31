"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class ResetPassword {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Complete the reset by verifying the short-lived token/code
     */
    async execute(token, newPasswordPlain) {
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
        const hashed = await bcryptjs_1.default.hash(newPasswordPlain, 10);
        const success = await this.userRepository.updatePassword(user.email, hashed);
        return success;
    }
}
exports.ResetPassword = ResetPassword;
