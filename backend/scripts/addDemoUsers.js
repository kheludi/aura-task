import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

async function addDemoUsers() {
    console.log('🔧 Adding demo users to database...\n');
    
    try {
        // Create Admin
        const [adminExists] = await pool.execute('SELECT * FROM users WHERE email = ?', ['admin@auratask.com']);
        if (adminExists.length === 0) {
            const adminHash = await bcrypt.hash('admin123', 10);
            await pool.execute(
                'INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
                ['admin', 'admin@auratask.com', adminHash, 'admin', 'active']
            );
            console.log('✅ Admin user created');
        } else {
            console.log('⚠️  Admin user already exists');
        }
        
        // Create Demo User
        const [demoExists] = await pool.execute('SELECT * FROM users WHERE email = ?', ['demo@auratask.com']);
        if (demoExists.length === 0) {
            const demoHash = await bcrypt.hash('demo123', 10);
            await pool.execute(
                'INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
                ['demouser', 'demo@auratask.com', demoHash, 'user', 'active']
            );
            console.log('✅ Demo user created');
        } else {
            console.log('⚠️  Demo user already exists');
        }
        
        console.log('\n✨ Demo accounts ready!');
        console.log('   Admin: admin@auratask.com / admin123');
        console.log('   Demo:  demo@auratask.com / demo123');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    process.exit();
}

addDemoUsers();