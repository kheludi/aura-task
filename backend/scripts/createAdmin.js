import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

async function createAdminUser() {
    console.log('🔧 Creating admin user...\n');
    
    try {
        // Check if admin already exists
        const [existing] = await pool.execute(
            'SELECT * FROM users WHERE email = ?', 
            ['admin@auratask.com']
        );
        
        if (existing.length > 0) {
            console.log('⚠️  Admin user already exists!');
            console.log('📧 Email: admin@auratask.com');
            console.log('🔑 Password: admin123');
        } else {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await pool.execute(
                'INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
                ['admin', 'admin@auratask.com', hashedPassword, 'admin', 'active']
            );
            console.log('✅ Admin user created successfully!');
            console.log('\n📋 Admin Credentials:');
            console.log('   Email: admin@auratask.com');
            console.log('   Password: admin123');
        }
        
        // Also create a demo user
        const [demoExists] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            ['demo@auratask.com']
        );
        
        if (demoExists.length === 0) {
            const demoHash = await bcrypt.hash('demo123', 10);
            await pool.execute(
                'INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
                ['demouser', 'demo@auratask.com', demoHash, 'user', 'active']
            );
            console.log('\n✅ Demo user created successfully!');
            console.log('   Email: demo@auratask.com');
            console.log('   Password: demo123');
        }
        
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
    }
    
    process.exit();
}

createAdminUser();