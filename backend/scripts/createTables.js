import pool from '../config/database.js';

async function createTables() {
    console.log('🔧 Creating database tables...\n');
    
    const usersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('user', 'admin') DEFAULT 'user',
            status ENUM('active', 'suspended') DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_email (email),
            INDEX idx_username (username)
        )
    `;
    
    const tasksTable = `
        CREATE TABLE IF NOT EXISTS tasks (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
            category VARCHAR(50) DEFAULT 'General',
            status ENUM('todo', 'doing', 'completed', 'overdue') DEFAULT 'todo',
            due_date DATE,
            position INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_user_status (user_id, status),
            INDEX idx_due_date (due_date),
            INDEX idx_priority (priority)
        )
    `;
    
    try {
        await pool.execute(usersTable);
        console.log('✅ Users table created');
        
        await pool.execute(tasksTable);
        console.log('✅ Tasks table created');
        
        console.log('\n✨ Tables created successfully!');
        console.log('📝 Run node scripts/createAdmin.js to create an admin user\n');
        
    } catch (error) {
        console.error('❌ Error creating tables:', error.message);
    }
    
    process.exit();
}

createTables();