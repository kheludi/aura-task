import bcrypt from 'bcryptjs';
import pool from './config/database.js';

async function createAdmin() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    try {
        await pool.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            ['admin', 'admin@auratask.com', hashedPassword, 'admin']
        );
        console.log('Admin user created successfully!');
        console.log('Email: admin@auratask.com');
        console.log('Password: admin123');
    } catch (error) {
        console.error('Error creating admin:', error.message);
    }
    
    process.exit();
}

createAdmin();