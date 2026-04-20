import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import adminRoutes from './routes/admin.js';
import Task from './models/Task.js';
import pool from './config/database.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Test database endpoint
app.get('/api/test-db', async (req, res) => {
    try {
        const [result] = await pool.execute('SELECT 1 as connected');
        res.json({ success: true, message: 'Database connected successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Run overdue task check every hour
setInterval(async () => {
    try {
        const count = await Task.checkOverdueTasks();
        if (count > 0) {
            console.log(`✅ Updated ${count} overdue tasks`);
        }
    } catch (error) {
        console.error('❌ Overdue check failed:', error.message);
    }
}, 3600000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Aura Task Backend Server`);
    console.log(`📡 Running on: http://localhost:${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Database test: http://localhost:${PORT}/api/test-db`);
    console.log(`\n✨ Server is ready to accept requests!\n`);
});