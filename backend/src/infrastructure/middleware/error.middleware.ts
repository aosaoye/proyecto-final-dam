import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('💥 Global Error Handled:', err);

  // Format database/connection specific errors to friendly strings
  let message = err.message || 'Internal Server Error';
  let statusCode = err.statusCode || 500;

  // Check for Mongoose/MongoDB specific timeouts or connectivity blocks
  if (message.includes('buffering timed out') || message.includes('ECONNREFUSED')) {
    statusCode = 503;
    message = 'El servidor no puede conectar con la base de datos actualmente. Verifica que MongoDB esté activo.';
  }
  
  // Handle duplicate key MongoDB
  if (err.code === 11000) {
    statusCode = 409;
    message = 'El recurso ya existe en el sistema (Duplicado).';
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    // Only send stack traces in strict development environment (optional)
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
