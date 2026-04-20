import bcrypt from 'bcryptjs';
import pool from './config/database.js';

async function addUser() {
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    try {
        // Check if user already exists
        const [existing] = await pool.execute('SELECT * FROM users WHERE email = ?', ['test@test.com']);
        
        if (existing.length > 0) {
            console.log('User already exists!');
        } else {
            await pool.execute(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                ['testuser', 'test@test.com', hashedPassword, 'user']
            );
            console.log('✅ Test user created successfully!');
        }
        
        // Also create admin if doesn't exist
        const [existingAdmin] = await pool.execute('SELECT * FROM users WHERE email = ?', ['admin@auratask.com']);
        
        if (existingAdmin.length === 0) {
            const adminHash = await bcrypt.hash('admin123', 10);
            await pool.execute(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                ['admin', 'admin@auratask.com', adminHash, 'admin']
            );
            console.log('✅ Admin user created successfully!');
        }
        
        console.log('\n📝 Login credentials:');
        console.log('User - Email: test@test.com, Password: test123');
        console.log('Admin - Email: admin@auratask.com, Password: admin123');
        
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    process.exit();
}

addUser();