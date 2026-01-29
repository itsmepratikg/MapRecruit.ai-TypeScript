const axios = require('axios');

async function testNoSQLInjection() {
    console.log('Testing NoSQL Injection on Login Endpoint...');

    // Target URL (assuming local server on 5000 based on context, or user can run it)
    const url = 'http://localhost:5000/api/auth/login';

    // Payload trying to bypass password check using {$ne: null}
    // "email": "valid@email.com", "password": { "$ne": null } 
    // If the backend is vulnerable, this might match if it constructs query: { password: req.body.password }

    const payload = {
        email: 'pratik.gaurav@maprecruit.ai', // Using a likely valid email
        password: { "$ne": "wrongpassword" }
    };

    try {
        console.log('Sending payload:', JSON.stringify(payload));
        const res = await axios.post(url, payload);
        console.log('Response Status:', res.status);
        console.log('Response Body:', res.data);

        if (res.status === 200) {
            console.log('❌ VULNERABLE: Login succeeded with injection payload.');
        } else {
            console.log('❓ Unexpected success status.');
        }
    } catch (error) {
        if (error.response) {
            console.log(`✅ SAFE: Server rejected request with status ${error.response.status}`);
            console.log('Response:', error.response.data);
        } else {
            console.log('Error connecting to server:', error.message);
            console.log('Ensure the server is running on localhost:5000');
        }
    }
}

testNoSQLInjection();
