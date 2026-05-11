import { OrderRepository } from '../../domain/repositories/OrderRepository';
import { Order } from '../../domain/entities/Order';
import { OrderModel } from '../models/OrderModel';

export class MongoOrderRepository implements OrderRepository {
  async create(order: Order): Promise<Order> {
    const doc = new OrderModel(order);
    const saved = await doc.save();
    return this.map(saved);
  }

  async findAll(): Promise<Order[]> {
    const docs = await OrderModel.find().sort({ createdAt: -1 }).populate('userId', 'name email');
    return docs.map(this.map);
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const docs = await OrderModel.find({ userId }).sort({ createdAt: -1 });
    return docs.map(this.map);
  }

  private map(doc: any): Order {
    const isPopulated = doc.userId && typeof doc.userId === 'object' && '_id' in doc.userId;
    
    return {
      id: doc._id.toString(),
      userId: isPopulated ? doc.userId._id.toString() : (doc.userId ? doc.userId.toString() : 'deleted-user'),
      userName: isPopulated ? doc.userId.name : undefined,
      userEmail: isPopulated ? doc.userId.email : undefined,
      items: doc.items || [],
      totalAmount: doc.totalAmount || 0,
      status: doc.status,
      createdAt: doc.createdAt
    };
  }
}
