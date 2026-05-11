import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { CartModel } from './src/infrastructure/models/CartModel';
import { OrderModel } from './src/infrastructure/models/OrderModel';

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected for diagnostics.');
    
    const carts = await CartModel.find().lean();
    console.log('TOTAL CARTS IN DB:', carts.length);
    if(carts.length > 0) console.log('FIRST CART EXAMPLE:', JSON.stringify(carts[0].items, null, 2));
    
    const orders = await OrderModel.find().lean();
    console.log('TOTAL ORDERS IN DB:', orders.length);
    if(orders.length > 0) console.log('FIRST ORDER EXAMPLE:', JSON.stringify(orders[0], null, 2));
    
    process.exit(0);
  } catch (e: any) {
    console.error('DIAGNOSTIC FAIL:', e.message);
    process.exit(1);
  }
}
run();
