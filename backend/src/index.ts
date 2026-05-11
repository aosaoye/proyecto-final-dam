import * as dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './infrastructure/config/db';

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
// Force nodemon reload trigger. Do not remove.
