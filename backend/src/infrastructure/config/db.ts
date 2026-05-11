import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// 100% Guaranteed manual parameters to bypass all URL parsing ambiguity
const config = {
    user: 'postgres.ccwyesttwlqsogwydaqc',
    host: 'aws-0-eu-west-1.pooler.supabase.com',
    database: 'postgres',
    password: 'JCqbZBsmngYOUcY4',
    port: 6543,
    ssl: {
        rejectUnauthorized: false
    }
};

export const pool = new Pool(config);

export const connectDB = async () => {
    try {
        console.log(`🔄 Final Attempt connecting to ${config.host} as ${config.user}...`);
        const client = await pool.connect();
        console.log(`🚀 PostgreSQL (Supabase) Connected successfully!`);
        client.release();
    } catch (error: any) {
        console.error(`❌ Postgres Connection Error: ${error.message}`);
        process.exit(1);
    }
};
