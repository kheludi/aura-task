import bcrypt from 'bcryptjs';
import db from '../config/database.js';

async function resetAdmin() {
    try {
        const newHash = await bcrypt.hash('admin123', 10);
        
        // Update the password specifically for the admin email
        await db.execute(
            'UPDATE users SET password = ? WHERE email = ?',
            [newHash, 'admin@auratask.com']
        );
        
        console.log('✅ Admin password has been forcefully reset to: admin123');
    } catch (error) {
        console.error('❌ Error resetting password:', error.message);
    }
    process.exit();
}

resetAdmin();