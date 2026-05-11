import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { MongoOrderRepository } from './src/infrastructure/repositories/MongoOrderRepository';
import { MongoCartRepository } from './src/infrastructure/repositories/MongoCartRepository';
import { MongoProductRepository } from './src/infrastructure/repositories/MongoProductRepository';
import { OrderUseCases } from './src/application/use-cases/order/OrderUseCases';

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    
    const orderRepo = new MongoOrderRepository();
    const cartRepo = new MongoCartRepository();
    const prodRepo = new MongoProductRepository();
    const useCases = new OrderUseCases(orderRepo, cartRepo, prodRepo);

    console.log('TRYING TO RETRIEVE ALL ORDERS DIRECTLY VIA USECASE...');
    const orders = await useCases.getAllOrders();
    console.log('SUCCESSFULLY RETRIEVED ORDERS:', orders.length);
    process.exit(0);
  } catch (e: any) {
    console.error('TEST FAILED:', e.message);
    process.exit(1);
  }
}
run();
