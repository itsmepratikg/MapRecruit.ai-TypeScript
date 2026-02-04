// Quick test to verify backend campaign endpoint
// Run with: node test_campaigns_api.js

const axios = require('axios');

async function testCampaignsAPI() {
    try {
        console.log('🧪 Testing Campaigns API...\n');

        // First, login to get a token
        console.log('1️⃣ Logging in...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'pratik.gaurav@maprecruit.ai',
            password: 'your_password_here' // You'll need to update this
        });

        const token = loginResponse.data.token;
        console.log('✅ Login successful, token received\n');

        // Test campaigns endpoint
        console.log('2️⃣ Fetching campaigns...');
        const campaignsResponse = await axios.get('http://localhost:5000/api/campaigns', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('✅ Campaigns received:', campaignsResponse.data.length);
        console.log('📊 Campaign statuses:');
        campaignsResponse.data.forEach(c => {
            console.log(`  - ${c.title}: ${c.status} (schema: ${c.schemaConfig?.mainSchema?.status})`);
        });

        // Test stats endpoint
        console.log('\n3️⃣ Fetching stats...');
        const statsResponse = await axios.get('http://localhost:5000/api/campaigns/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('✅ Stats received:', statsResponse.data);

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testCampaignsAPI();
