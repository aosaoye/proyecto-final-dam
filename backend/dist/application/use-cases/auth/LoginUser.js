"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LoginUser {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.password) {
            throw new Error('Invalid credentials');
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        const { password: _, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }
}
exports.LoginUser = LoginUser;
