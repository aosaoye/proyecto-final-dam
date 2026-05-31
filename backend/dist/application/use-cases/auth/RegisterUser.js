"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class RegisterUser {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userData) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('El usuario ya existe');
        }
        const allUsers = await this.userRepository.findAll();
        // Si es el primer usuario del sistema, hacerlo administrador automáticamente
        const role = allUsers.length === 0 ? 'admin' : (userData.role || 'user');
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
        const newUser = {
            ...userData,
            password: hashedPassword,
            role: role
        };
        return this.userRepository.save(newUser);
    }
}
exports.RegisterUser = RegisterUser;
