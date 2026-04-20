import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Task from '../models/Task.js';

const router = express.Router();

router.use(authenticate);

// Get all tasks for current user
router.get('/', async (req, res) => {
    try {
        await Task.checkOverdueTasks();
        const tasks = await Task.findByUser(req.userId);
        res.json(tasks);
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Get tasks by status
router.get('/status/:status', async (req, res) => {
    try {
        const { status } = req.params;
        const tasks = await Task.getTasksByStatus(req.userId, status);
        res.json(tasks);
    } catch (error) {
        console.error('Get tasks by status error:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Search tasks
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.json([]);
        }
        const tasks = await Task.searchTasks(req.userId, q);
        res.json(tasks);
    } catch (error) {
        console.error('Search tasks error:', error);
        res.status(500).json({ error: 'Failed to search tasks' });
    }
});

// Create new task
router.post('/', async (req, res) => {
    try {
        const { title, description, priority, category, dueDate, status } = req.body;
        
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Task title is required' });
        }
        
        const taskId = await Task.create({
            userId: req.userId,
            title: title.trim(),
            description: description || '',
            priority: priority || 'medium',
            category: category || 'General',
            dueDate: dueDate || null,
            status: status || 'todo'
        });
        
        const tasks = await Task.findByUser(req.userId);
        const newTask = tasks.find(t => t.id === taskId);
        
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Update task
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const updated = await Task.update(id, req.userId, updates);
        if (!updated) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        const tasks = await Task.findByUser(req.userId);
        const updatedTask = tasks.find(t => t.id === parseInt(id));
        
        res.json(updatedTask);
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Update task status (for drag and drop)
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const updated = await Task.updateStatus(id, req.userId, status);
        if (!updated) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        const tasks = await Task.findByUser(req.userId);
        res.json(tasks);
    } catch (error) {
        console.error('Update task status error:', error);
        res.status(500).json({ error: 'Failed to update task status' });
    }
});

// Update multiple task positions
router.put('/positions', async (req, res) => {
    try {
        const { updates } = req.body;
        
        if (!Array.isArray(updates)) {
            return res.status(400).json({ error: 'Invalid updates format' });
        }
        
        await Task.updatePositions(req.userId, updates);
        res.json({ success: true });
    } catch (error) {
        console.error('Update positions error:', error);
        res.status(500).json({ error: 'Failed to update task positions' });
    }
});

// Delete task
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const deleted = await Task.delete(id, req.userId);
        if (!deleted) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Get task statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const tasks = await Task.findByUser(req.userId);
        const stats = {
            total: tasks.length,
            todo: tasks.filter(t => t.status === 'todo').length,
            doing: tasks.filter(t => t.status === 'doing').length,
            completed: tasks.filter(t => t.status === 'completed').length,
            overdue: tasks.filter(t => t.status === 'overdue').length,
            byPriority: {
                low: tasks.filter(t => t.priority === 'low').length,
                medium: tasks.filter(t => t.priority === 'medium').length,
                high: tasks.filter(t => t.priority === 'high').length
            }
        };
        res.json(stats);
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

export default router;