import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
    static async create({ username, email, password }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, 'user', 'active']
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findByUsername(username) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id, username, email, role, status, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async getAllUsers() {
        const [rows] = await pool.execute(
            'SELECT id, username, email, role, status, created_at FROM users ORDER BY created_at DESC'
        );
        return rows;
    }

    static async updateRole(userId, role) {
        const [result] = await pool.execute('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
        return result.affectedRows > 0;
    }

    static async updateStatus(userId, status) {
        const [result] = await pool.execute('UPDATE users SET status = ? WHERE id = ?', [status, userId]);
        return result.affectedRows > 0;
    }

    static async getUserTaskSummary(userId) {
        const [rows] = await pool.execute(
            `SELECT 
                COUNT(CASE WHEN status = 'todo' THEN 1 END) as pending,
                COUNT(CASE WHEN status = 'doing' THEN 1 END) as in_progress,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
                COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue,
                COUNT(*) as total
            FROM tasks WHERE user_id = ?`,
            [userId]
        );
        return rows[0];
    }

    static async deleteUser(userId) {
        const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
        return result.affectedRows > 0;
    }
}

export default User;