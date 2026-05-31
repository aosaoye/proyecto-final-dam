"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    loginUser;
    registerUser;
    resetPasswordUseCase;
    requestResetUseCase;
    getAllUsersUseCase;
    constructor(loginUser, registerUser, resetPasswordUseCase, requestResetUseCase, getAllUsersUseCase) {
        this.loginUser = loginUser;
        this.registerUser = registerUser;
        this.resetPasswordUseCase = resetPasswordUseCase;
        this.requestResetUseCase = requestResetUseCase;
        this.getAllUsersUseCase = getAllUsersUseCase;
    }
    async getAllUsers(req, res, next) {
        try {
            const users = await this.getAllUsersUseCase.execute();
            res.json(users);
        }
        catch (error) {
            next(error);
        }
    }
    async register(req, res, next) {
        try {
            const user = await this.registerUser.execute(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            next(error); // Delegar al manejador global
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await this.loginUser.execute(email, password);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async requestReset(req, res, next) {
        try {
            const { email } = req.body;
            if (!email)
                throw new Error('Introduce un correo electrónico.');
            await this.requestResetUseCase.execute(email);
            res.json({ message: 'Simulación enviada: El código ha sido impreso en el terminal del servidor.' });
        }
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword)
                throw new Error('Código y Nueva Contraseña obligatorios.');
            const success = await this.resetPasswordUseCase.execute(token, newPassword);
            res.json({ success, message: 'Contraseña restablecida correctamente.' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
