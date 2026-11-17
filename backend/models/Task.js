import db from '../config/database.js';

class Task {
    static async create({ userId, title, description, priority, category, dueDate, status = 'todo' }) {
        const [rows] = await db.execute(
            `INSERT INTO tasks (user_id, title, description, priority, category, due_date, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id`,
            [userId, title, description || '', priority, category || 'General', dueDate || null, status]
        );
        return rows[0].id;
    }

    static async findByUser(userId) {
        const [rows] = await db.execute(
            `SELECT * FROM tasks WHERE user_id = ? 
             ORDER BY CASE status WHEN 'todo' THEN 1 WHEN 'doing' THEN 2 WHEN 'completed' THEN 3 WHEN 'overdue' THEN 4 END, 
             position ASC, created_at DESC`,
            [userId]
        );
        return rows;
    }

    static async updateStatus(id, userId, status) {
        await db.execute('UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?', [status, id, userId]);
        return true;
    }

    static async update(id, userId, updates) {
        const fields = [];
        const values = [];
        
        const allowedFields = ['title', 'description', 'priority', 'category', 'due_date'];
        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(updates[field]);
            }
        }
        
        if (fields.length === 0) return false;
        values.push(id, userId);
        
        await db.execute(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`, values);
        return true;
    }

    static async delete(id, userId) {
        await db.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
        return true;
    }

    static async checkOverdueTasks() {
        await db.execute(
            `UPDATE tasks 
             SET status = 'overdue' 
             WHERE due_date < CURRENT_DATE 
             AND due_date IS NOT NULL
             AND status IN ('todo', 'doing')`
        );
    }

    static async getAdminSummary() {
        const [rows] = await db.execute(
            `SELECT 
                u.id, u.username, u.email, u.role, u.status as user_status,
                COUNT(t.id)::int as total_tasks,
                SUM(CASE WHEN t.status = 'todo' THEN 1 ELSE 0 END)::int as pending,
                SUM(CASE WHEN t.status = 'doing' THEN 1 ELSE 0 END)::int as in_progress,
                SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END)::int as completed,
                SUM(CASE WHEN t.status = 'overdue' THEN 1 ELSE 0 END)::int as overdue
            FROM users u
            LEFT JOIN tasks t ON u.id = t.user_id
            GROUP BY u.id, u.username, u.email, u.role, u.status
            ORDER BY u.created_at DESC`
        );
        return rows;
    }
}

export default Task;