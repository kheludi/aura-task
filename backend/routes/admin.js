import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

const router = express.Router();

// Require authentication and admin role for all routes in this file
router.use(authenticate);
router.use(isAdmin);

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get task summary for all users
router.get('/summary', async (req, res) => {
    try {
        const summary = await Task.getAdminSummary();
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
});

// Update user role (Make Admin / Remove Admin)
router.put('/users/:id/role', async (req, res) => {
    try {
        await User.updateRole(req.params.id, req.body.role);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update role' });
    }
});

// Update user status (Suspend / Activate)
router.put('/users/:id/status', async (req, res) => {
    try {
        await User.updateStatus(req.params.id, req.body.status);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update status' });
    }
});

export default router;