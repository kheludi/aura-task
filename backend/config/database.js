import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Adaptor to make PostgreSQL work like MySQL (returning [rows, fields])
const db = {
    execute: async (sql, params = []) => {
        let index = 1;
        const pgSql = sql.replace(/\?/g, () => `$${index++}`);
        const result = await pool.query(pgSql, params);
        return [result.rows, result.fields]; 
    },
    getConnection: () => pool.connect()
};

export default db;