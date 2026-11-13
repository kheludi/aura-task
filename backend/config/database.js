import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // This is required for Neon/Render cloud databases
    }
});

const db = {
    execute: async (sql, params) => {
        let index = 1;
        const pgSql = sql.replace(/\?/g, () => `$${index++}`);
        const result = await pool.query(pgSql, params);
        return [result.rows, result.fields]; 
    },
    getConnection: () => pool.connect()
};

export default db;