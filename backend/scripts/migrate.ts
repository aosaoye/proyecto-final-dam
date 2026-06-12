import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

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

const pool = new Pool(config);

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('🔄 Running migration: adding glb_url to products...');
    await client.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS glb_url VARCHAR(255) DEFAULT NULL;
    `);
    console.log('✅ Migration successful! glb_url column added.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
  }
}

runMigration();
