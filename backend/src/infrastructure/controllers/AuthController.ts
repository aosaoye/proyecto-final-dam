import { Request, Response, NextFunction } from 'express';
import { LoginUser } from '../../application/use-cases/auth/LoginUser';
import { RegisterUser } from '../../application/use-cases/auth/RegisterUser';
import { ResetPassword } from '../../application/use-cases/auth/ResetPassword';
import { RequestPasswordReset } from '../../application/use-cases/auth/RequestPasswordReset';
import { GetAllUsers } from '../../application/use-cases/auth/GetAllUsers';

export class AuthController {
  constructor(
    private loginUser: LoginUser,
    private registerUser: RegisterUser,
    private resetPasswordUseCase: ResetPassword,
    private requestResetUseCase: RequestPasswordReset,
    private getAllUsersUseCase: GetAllUsers
  ) {}

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.getAllUsersUseCase.execute();
      res.json(users);
    } catch (error: any) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.registerUser.execute(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      next(error); // Delegar al manejador global
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await this.loginUser.execute(email, password);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async requestReset(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) throw new Error('Introduce un correo electrónico.');
      await this.requestResetUseCase.execute(email);
      res.json({ message: 'Simulación enviada: El código ha sido impreso en el terminal del servidor.' });
    } catch (error: any) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) throw new Error('Código y Nueva Contraseña obligatorios.');
      const success = await this.resetPasswordUseCase.execute(token, newPassword);
      res.json({ success, message: 'Contraseña restablecida correctamente.' });
    } catch (error: any) {
      next(error);
    }
  }
}
