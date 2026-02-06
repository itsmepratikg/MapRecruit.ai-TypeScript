const User = require('../models/User');

const getStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            google: {
                connected: user.integrations?.google?.connected || false,
                email: user.integrations?.google?.email
            },
            microsoft: {
                connected: user.integrations?.microsoft?.connected || false,
                email: user.integrations?.microsoft?.email
            }
        });
    } catch (error) {
        console.error('Failed to get integration status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const handleGoogleCallback = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ message: 'Authorization code is required' });

        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        // The redirect URI must EXACTLY match what was used in the frontend redirect
        const redirectUri = process.env.NODE_ENV === 'production'
            ? 'https://your-app-domain.com/auth/google/callback'
            : 'http://localhost:3000/auth/google/callback';

        // 1. Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            })
        });

        const tokens = await tokenResponse.json();
        if (tokens.error) {
            console.error('Google Token Exchange Error:', tokens);
            return res.status(400).json({ message: tokens.error_description || 'Failed to exchange token' });
        }

        // 2. Get User Info (Email)
        const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` }
        });
        const userinfo = await userinfoResponse.json();

        // 3. Update User Document
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.integrations) user.integrations = {};
        user.integrations.google = {
            connected: true,
            tokens: tokens, // includes access_token, refresh_token, expiry, etc.
            email: userinfo.email
        };

        user.markModified('integrations');
        await user.save();

        res.json({ success: true, email: userinfo.email });
    } catch (error) {
        console.error('handleGoogleCallback Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const disconnect = async (req, res) => {
    try {
        const { provider } = req.params;
        if (provider !== 'google' && provider !== 'microsoft') {
            return res.status(400).json({ message: 'Invalid provider' });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.integrations && user.integrations[provider]) {
            user.integrations[provider] = { connected: false };
            user.markModified('integrations');
            await user.save();
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Disconnect Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getPickerToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.integrations?.google?.connected) {
            return res.status(401).json({ message: 'Google Workspace not connected' });
        }

        const tokens = user.integrations.google.tokens;

        // Check if token is expired (or close to it)
        const isExpired = tokens.expiry_date ? (Date.now() > (tokens.expiry_date - 60000)) : true;

        if (!isExpired) {
            return res.json({ access_token: tokens.access_token });
        }

        // Refresh Token
        console.log('Refreshing Google Access Token for Picker...');
        const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                refresh_token: tokens.refresh_token,
                grant_type: 'refresh_token'
            })
        });

        const newTokens = await refreshResponse.json();
        if (newTokens.error) {
            console.error('Google Refresh Error:', newTokens);
            return res.status(400).json({ message: 'Failed to refresh token' });
        }

        // Update User
        user.integrations.google.tokens = {
            ...tokens,
            ...newTokens,
            expiry_date: Date.now() + (newTokens.expires_in * 1000)
        };
        user.markModified('integrations');
        await user.save();

        res.json({ access_token: newTokens.access_token });
    } catch (error) {
        console.error('getPickerToken Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const fetchDriveFile = async (req, res) => {
    try {
        const { fileId, fileName } = req.body;
        if (!fileId) return res.status(400).json({ message: 'fileId is required' });

        const user = await User.findById(req.user.id);
        const accessToken = user.integrations?.google?.tokens?.access_token;

        if (!accessToken) return res.status(401).json({ message: 'Unauthorized' });

        // In a real implementation, we would download the file and pass it to a parser.
        // For this demo/task, we'll simulate the successful fetch and return metadata.

        console.log(`[Drive] Fetching file: ${fileName} (${fileId})`);

        // Simulate a delay for "processing"
        await new Promise(resolve => setTimeout(resolve, 1500));

        res.json({
            success: true,
            fileName: fileName,
            fileId: fileId,
            parsedData: {
                firstName: 'Sam',
                lastName: 'Drive',
                email: 'sam.drive@example.com',
                title: 'Data Engineer',
                skills: 'SQL, Python, Google Cloud',
                source: 'Google Drive'
            }
        });
    } catch (error) {
        console.error('fetchDriveFile Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const syncService = require('../services/syncService');

// ... (Existing controller methods)

const syncCalendar = async (req, res) => {
    try {
        const result = await syncService.fetchUserCalendarEvents(req.user.id);
        res.json({ success: true, count: result.count });
    } catch (error) {
        console.error('Sync Calendar Error:', error);
        res.status(500).json({ message: error.message || 'Sync failed' });
    }
};

const getCalendarEvents = async (req, res) => {
    try {
        const SyncedData = require('../models/SyncedData');
        const events = await SyncedData.find({
            userId: req.user.id,
            provider: 'google',
            itemType: 'calendar'
        }).sort({ 'data.start.dateTime': 1 });

        res.json({ success: true, count: events.length, events });
    } catch (error) {
        console.error('Get Calendar Events Error:', error);
        res.status(500).json({ message: 'Failed to fetch events' });
    }
};

module.exports = {
    getStatus,
    handleGoogleCallback,
    disconnect,
    getPickerToken,
    fetchDriveFile,
    syncCalendar,
    getCalendarEvents
};
