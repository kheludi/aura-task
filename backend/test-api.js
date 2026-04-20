import axios from 'axios';

async function testLogin() {
    console.log('Testing login API...\n');
    
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'test@test.com',
            password: 'test123'
        });
        
        console.log('✅ Login successful!');
        console.log('Response:', response.data);
        console.log('\nToken received:', response.data.token.substring(0, 50) + '...');
        
    } catch (error) {
        console.error('❌ Login failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error message:', error.response.data);
        } else if (error.request) {
            console.error('No response from server. Is backend running?');
        } else {
            console.error('Error:', error.message);
        }
    }
}

testLogin();