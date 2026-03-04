const axios = require('axios');

async function testPresence() {
    const baseUrl = 'http://localhost:5000/api';
    const testPayload = {
        userId: 'test_user_123',
        campaignId: 'test_campaign_abc',
        user: {
            firstName: 'Test',
            lastName: 'Bot',
            email: 'test@maprecruit.ai',
            color: 'blue'
        },
        page: 'Intelligence'
    };

    try {
        console.log('Sending heartbeat...');
        const response = await axios.post(`${baseUrl}/presence/heartbeat`, testPayload);
        console.log('Response Status:', response.status);
        console.log('Active Users Count:', response.data.length);
        console.log('User Data Sample:', JSON.stringify(response.data[0], null, 2));

        if (response.data.length > 0) {
            console.log('\n✅ VERIFICATION SUCCESSFUL: Presence data saved and retrieved.');
        } else {
            console.log('\n❌ VERIFICATION FAILED: No data returned.');
        }
    } catch (error) {
        console.error('\n❌ ERROR connecting to backend:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
        console.log('\nNOTE: Make sure your backend (npm run dev in /backend) is running before verifying.');
    }
}

testPresence();
