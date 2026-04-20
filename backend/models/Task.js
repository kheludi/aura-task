import pool from '../config/database.js';

class Task {
    static async create({ userId, title, description, priority, category, dueDate, status = 'todo' }) {
        const [result] = await pool.execute(
            'INSERT INTO tasks (user_id, title, description, priority, category, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, title, description || '', priority, category || 'General', dueDate || null, status]
        );
        return result.insertId;
    }

    static async findByUser(userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM tasks WHERE user_id = ? ORDER BY FIELD(status, "todo", "doing", "completed", "overdue"), position ASC, created_at DESC',
            [userId]
        );
        return rows;
    }

    static async findById(id, userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return rows[0];
    }

    static async update(id, userId, updates) {
        const allowedFields = ['title', 'description', 'priority', 'category', 'due_date', 'status'];
        const fields = [];
        const values = [];
        
        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(updates[field]);
            }
        }
        
        if (fields.length === 0) return false;
        
        values.push(id, userId);
        const [result] = await pool.execute(
            `UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
            values
        );
        
        return result.affectedRows > 0;
    }

    static async updateStatus(id, userId, status) {
        const [result] = await pool.execute(
            'UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?',
            [status, id, userId]
        );
        return result.affectedRows > 0;
    }

    static async updatePositions(userId, updates) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            for (const { id, position, status } of updates) {
                await connection.execute(
                    'UPDATE tasks SET position = ?, status = ? WHERE id = ? AND user_id = ?',
                    [position, status, id, userId]
                );
            }
            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(id, userId) {
        const [result] = await pool.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
        return result.affectedRows > 0;
    }

    static async checkOverdueTasks() {
        const [result] = await pool.execute(
            `UPDATE tasks 
             SET status = 'overdue' 
             WHERE due_date < CURDATE() 
             AND due_date IS NOT NULL
             AND status IN ('todo', 'doing')`
        );
        return result.affectedRows;
    }

    static async getAdminSummary() {
        const [rows] = await pool.execute(
            `SELECT 
                u.id, 
                u.username,
                u.email,
                u.role,
                u.status as user_status,
                COUNT(t.id) as total_tasks,
                SUM(CASE WHEN t.status = 'todo' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN t.status = 'doing' THEN 1 ELSE 0 END) as in_progress,
                SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN t.status = 'overdue' THEN 1 ELSE 0 END) as overdue
            FROM users u
            LEFT JOIN tasks t ON u.id = t.user_id
            GROUP BY u.id, u.username, u.email, u.role, u.status
            ORDER BY u.created_at DESC`
        );
        return rows;
    }

    static async getTasksByStatus(userId, status) {
        const [rows] = await pool.execute(
            'SELECT * FROM tasks WHERE user_id = ? AND status = ? ORDER BY position ASC',
            [userId, status]
        );
        return rows;
    }

    static async searchTasks(userId, keyword) {
        const [rows] = await pool.execute(
            `SELECT * FROM tasks 
             WHERE user_id = ? 
             AND (title LIKE ? OR description LIKE ?) 
             ORDER BY created_at DESC`,
            [userId, `%${keyword}%`, `%${keyword}%`]
        );
        return rows;
    }
}

export default Task;