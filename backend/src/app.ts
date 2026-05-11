import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import authRoutes from './infrastructure/routes/auth.routes';
import productRoutes from './infrastructure/routes/product.routes';
import cartRoutes from './infrastructure/routes/cart.routes';
import orderRoutes from './infrastructure/routes/order.routes';

import { globalErrorHandler } from './infrastructure/middleware/error.middleware';

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // In production, you'd restrict this to your specific domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Required for browsers to load images across origins
}));
app.use(express.json());

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP' });
});

// Global Error Handler (Must be registered LAST)
app.use(globalErrorHandler);

export default app;
