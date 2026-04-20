import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

const router = express.Router();

router.use(authenticate);
router.use(isAdmin);

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get user task summary for all users
router.get('/summary', async (req, res) => {
    try {
        const summary = await Task.getAdminSummary();
        res.json(summary);
    } catch (error) {
        console.error('Get summary error:', error);
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
});

// Get specific user details with tasks
router.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const tasks = await Task.findByUser(id);
        const summary = await User.getUserTaskSummary(id);
        
        res.json({ user, tasks, summary });
    } catch (error) {
        console.error('Get user details error:', error);
        res.status(500).json({ error: 'Failed to fetch user details' });
    }
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        
        if (role !== 'user' && role !== 'admin') {
            return res.status(400).json({ error: 'Invalid role' });
        }
        
        const updated = await User.updateRole(id, role);
        if (!updated) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ success: true, message: `User role updated to ${role}` });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// Update user status
router.put('/users/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (status !== 'active' && status !== 'suspended') {
            return res.status(400).json({ error: 'Invalid status' });
        }
        
        const updated = await User.updateStatus(id, status);
        if (!updated) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ success: true, message: `User ${status === 'active' ? 'activated' : 'suspended'}` });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Failed to update user status' });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const deleted = await User.deleteUser(id);
        if (!deleted) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Get system statistics
router.get('/stats/system', async (req, res) => {
    try {
        const users = await User.getAllUsers();
        const summary = await Task.getAdminSummary();
        
        const stats = {
            totalUsers: users.length,
            activeUsers: users.filter(u => u.status === 'active').length,
            suspendedUsers: users.filter(u => u.status === 'suspended').length,
            adminUsers: users.filter(u => u.role === 'admin').length,
            totalTasks: summary.reduce((sum, u) => sum + (u.total_tasks || 0), 0),
            completedTasks: summary.reduce((sum, u) => sum + (u.completed || 0), 0),
            pendingTasks: summary.reduce((sum, u) => sum + (u.pending || 0), 0),
            overdueTasks: summary.reduce((sum, u) => sum + (u.overdue || 0), 0)
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Get system stats error:', error);
        res.status(500).json({ error: 'Failed to fetch system statistics' });
    }
});

export default router;