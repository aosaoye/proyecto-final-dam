import { Router } from 'express';
import { PostgresUserRepository } from '../repositories/PostgresUserRepository';
import { LoginUser } from '../../application/use-cases/auth/LoginUser';
import { RegisterUser } from '../../application/use-cases/auth/RegisterUser';
import { ResetPassword } from '../../application/use-cases/auth/ResetPassword';
import { RequestPasswordReset } from '../../application/use-cases/auth/RequestPasswordReset';
import { GetAllUsers } from '../../application/use-cases/auth/GetAllUsers';
import { EmailService } from '../services/EmailService';
import { AuthController } from '../controllers/AuthController';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

const userRepository = new PostgresUserRepository();
const emailService = new EmailService();

const loginUser = new LoginUser(userRepository);
const registerUser = new RegisterUser(userRepository);
const resetPassword = new ResetPassword(userRepository);
const requestReset = new RequestPasswordReset(userRepository, emailService);
const getAllUsers = new GetAllUsers(userRepository);
const authController = new AuthController(loginUser, registerUser, resetPassword, requestReset, getAllUsers);

router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/request-reset', (req, res, next) => authController.requestReset(req, res, next));
router.post('/reset-password', (req, res, next) => authController.resetPassword(req, res, next));

// Secure endpoint accessible only to admins
router.get('/users', authenticateJWT, authorizeRole('admin'), (req: any, res: any, next: any) => authController.getAllUsers(req, res, next));

export default router;
