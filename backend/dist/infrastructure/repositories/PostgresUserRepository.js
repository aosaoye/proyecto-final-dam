"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresUserRepository = void 0;
const db_1 = require("../config/db");
class PostgresUserRepository {
    async findByEmail(email) {
        const result = await db_1.pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
        if (result.rows.length === 0)
            return null;
        return this.mapToEntity(result.rows[0]);
    }
    async findById(id) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id))
            return null;
        const result = await db_1.pool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
        if (result.rows.length === 0)
            return null;
        return this.mapToEntity(result.rows[0]);
    }
    async save(user) {
        // Using UPSERT simulation for relational DB save pattern
        if (user.id) {
            // Update
            const result = await db_1.pool.query(`UPDATE users 
         SET name = $1, email = $2, role = $3, password = $4 
         WHERE id = $5 
         RETURNING *`, [user.name, user.email, user.role || 'customer', user.password, user.id]);
            return this.mapToEntity(result.rows[0]);
        }
        else {
            // Insert new
            const result = await db_1.pool.query(`INSERT INTO users (name, email, role, password) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`, [user.name, user.email, user.role || 'customer', user.password]);
            return this.mapToEntity(result.rows[0]);
        }
    }
    async findAll() {
        const result = await db_1.pool.query('SELECT * FROM users ORDER BY created_at DESC');
        return result.rows.map((row) => this.mapToEntity(row));
    }
    async updatePassword(email, passwordHash) {
        const result = await db_1.pool.query('UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE email = $2', [passwordHash, email]);
        return (result.rowCount !== null && result.rowCount > 0);
    }
    async saveResetToken(email, token, expires) {
        await db_1.pool.query('UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3', [token, expires, email]);
    }
    async findByResetToken(token) {
        const result = await db_1.pool.query('SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW() LIMIT 1', [token]);
        if (result.rows.length === 0)
            return null;
        return this.mapToEntity(result.rows[0]);
    }
    mapToEntity(row) {
        return {
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password,
            role: row.role,
            createdAt: row.created_at,
            resetPasswordToken: row.reset_password_token,
            resetPasswordExpires: row.reset_password_expires
        };
    }
}
exports.PostgresUserRepository = PostgresUserRepository;
