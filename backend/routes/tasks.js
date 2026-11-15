import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching tasks:', err.message);
    res.status(500).json({ error: 'Server error fetching tasks' });
  }
});

// POST create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, category, due_date } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, status, priority, category, due_date) VALUES (?, ?, ?, ?, ?, ?)',
      [
        title, 
        description || '', 
        status || 'todo', 
        priority || 'medium', 
        category || 'general', 
        due_date || null
      ]
    );

    const [newTask] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(newTask[0]);
  } catch (err) {
    console.error('Error creating task:', err.message);
    res.status(500).json({ error: 'Server error creating task' });
  }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err.message);
    res.status(500).json({ error: 'Server error deleting task' });
  }
});

export default router;