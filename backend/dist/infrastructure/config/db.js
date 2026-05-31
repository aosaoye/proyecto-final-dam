"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectionString = process.env.DATABASE_URL;
const poolConfig = connectionString
    ? {
        connectionString,
        ssl: { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
    }
    : {
        user: process.env.DB_USER || 'postgres.ccwyesttwlqsogwydaqc',
        host: process.env.DB_HOST || 'aws-0-eu-west-1.pooler.supabase.com',
        database: process.env.DB_NAME || 'postgres',
        password: process.env.DB_PASSWORD || 'JCqbZBsmngYOUcY4',
        port: Number(process.env.DB_PORT) || 6543,
        ssl: { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
    };
console.log("🔌 Initializing PostgreSQL Connection Pool...");
exports.pool = new pg_1.Pool(poolConfig);
// Handle unexpected errors on idle clients
exports.pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle PostgreSQL client:', err.message);
});
const connectDB = async (retries = 5, delay = 3000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`🔄 [Attempt ${attempt}/${retries}] Connecting to database...`);
            const client = await exports.pool.connect();
            console.log(`🚀 PostgreSQL Connected successfully on attempt ${attempt}!`);
            client.release();
            return;
        }
        catch (error) {
            console.error(`⚠️ Database connection attempt ${attempt} failed: ${error.message}`);
            if (attempt === retries) {
                console.error(`❌ All ${retries} database connection attempts failed. Exiting server process.`);
                process.exit(1);
            }
            console.log(`⏱️ Waiting ${delay / 1000}s before next attempt...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
};
exports.connectDB = connectDB;
