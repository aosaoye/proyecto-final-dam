"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresOrderRepository = void 0;
const db_1 = require("../config/db");
class PostgresOrderRepository {
    async create(order) {
        const client = await db_1.pool.connect();
        try {
            await client.query('BEGIN');
            // 1. Insert high level order summary header
            const orderResult = await client.query(`INSERT INTO orders (user_id, total_amount, status) 
         VALUES ($1, $2, $3) 
         RETURNING *`, [order.userId, order.totalAmount, order.status || 'pending']);
            const orderId = orderResult.rows[0].id;
            // 2. Insert transactional order line items individually
            for (const item of order.items) {
                await client.query(`INSERT INTO order_items (order_id, product_id, quantity, price, product_name) 
           VALUES ($1, $2, $3, $4, $5)`, [
                    orderId,
                    item.productId,
                    item.quantity,
                    item.price,
                    item.productName
                ]);
            }
            await client.query('COMMIT');
            return {
                ...order,
                id: orderId,
                createdAt: orderResult.rows[0].created_at
            };
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async findAll() {
        // Heavy JOIN or execute two queries efficiently
        // Let's fetch headers with user info first
        const result = await db_1.pool.query(`SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`);
        const orders = [];
        for (const row of result.rows) {
            const itemsResult = await db_1.pool.query('SELECT * FROM order_items WHERE order_id = $1', [row.id]);
            orders.push(this.mapToEntity(row, itemsResult.rows));
        }
        return orders;
    }
    async findByUserId(userId) {
        const result = await db_1.pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        const orders = [];
        for (const row of result.rows) {
            const itemsResult = await db_1.pool.query('SELECT * FROM order_items WHERE order_id = $1', [row.id]);
            orders.push(this.mapToEntity(row, itemsResult.rows));
        }
        return orders;
    }
    mapToEntity(row, itemsRows) {
        const items = itemsRows.map((i) => ({
            productId: i.product_id,
            quantity: parseInt(i.quantity, 10),
            price: parseFloat(i.price),
            productName: i.product_name
        }));
        return {
            id: row.id,
            userId: row.user_id,
            items,
            totalAmount: parseFloat(row.total_amount),
            status: row.status,
            createdAt: row.created_at,
            userName: row.user_name,
            userEmail: row.user_email
        };
    }
}
exports.PostgresOrderRepository = PostgresOrderRepository;
