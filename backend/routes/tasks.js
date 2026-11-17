import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Task from '../models/Task.js';

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
    try {
        await Task.checkOverdueTasks();
        const tasks = await Task.findByUser(req.userId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, priority, category, dueDate } = req.body;
        if (!title) return res.status(400).json({ error: 'Task title is required' });
        
        await Task.create({ userId: req.userId, title, description, priority, category, dueDate });
        const tasks = await Task.findByUser(req.userId);
        res.status(201).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

router.patch('/:id/status', async (req, res) => {
    try {
        await Task.updateStatus(req.params.id, req.userId, req.body.status);
        const tasks = await Task.findByUser(req.userId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        await Task.update(req.params.id, req.userId, req.body);
        const tasks = await Task.findByUser(req.userId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Task.delete(req.params.id, req.userId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

export default router;