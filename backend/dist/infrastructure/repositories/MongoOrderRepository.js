"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoOrderRepository = void 0;
const OrderModel_1 = require("../models/OrderModel");
class MongoOrderRepository {
    async create(order) {
        const doc = new OrderModel_1.OrderModel(order);
        const saved = await doc.save();
        return this.map(saved);
    }
    async findAll() {
        const docs = await OrderModel_1.OrderModel.find().sort({ createdAt: -1 }).populate('userId', 'name email');
        return docs.map(this.map);
    }
    async findByUserId(userId) {
        const docs = await OrderModel_1.OrderModel.find({ userId }).sort({ createdAt: -1 });
        return docs.map(this.map);
    }
    map(doc) {
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
exports.MongoOrderRepository = MongoOrderRepository;
