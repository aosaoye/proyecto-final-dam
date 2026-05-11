import { Router } from 'express';
import { PostgresProductRepository } from '../repositories/PostgresProductRepository';
import { ProductUseCases } from '../../application/use-cases/products/ProductUseCases';
import { ProductController } from '../controllers/ProductController';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';
import { upload } from '../config/multer';

const router = Router();

const productRepository = new PostgresProductRepository();
const productUseCases = new ProductUseCases(productRepository);
const productController = new ProductController(productUseCases);

router.get('/', (req, res, next) => productController.getAll(req, res, next));
router.get('/:id', (req, res, next) => productController.getById(req, res, next));

// Dashboard/Intranet - Protected Routes for Admin
router.post('/', authenticateJWT, authorizeRole('admin'), upload.single('image'), (req, res, next) => productController.create(req, res, next));
router.put('/:id', authenticateJWT, authorizeRole('admin'), upload.single('image'), (req, res, next) => productController.update(req, res, next));
router.delete('/:id', authenticateJWT, authorizeRole('admin'), (req, res, next) => productController.delete(req, res, next));

export default router;
