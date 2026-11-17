import db from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
    static async create({ username, email, password }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [rows] = await db.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?) RETURNING id',
            [username, email, hashedPassword]
        );
        return rows[0].id;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findByUsername(username) {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT id, username, email, role, status, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async getAllUsers() {
        const [rows] = await db.execute(
            'SELECT id, username, email, role, status, created_at FROM users ORDER BY created_at DESC'
        );
        return rows;
    }

    static async updateRole(userId, role) {
        await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
        return true;
    }

    static async updateStatus(userId, status) {
        await db.execute('UPDATE users SET status = ? WHERE id = ?', [status, userId]);
        return true;
    }

    static async deleteUser(userId) {
        await db.execute('DELETE FROM users WHERE id = ?', [userId]);
        return true;
    }
}

export default User;