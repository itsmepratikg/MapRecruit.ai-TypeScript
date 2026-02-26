const { google } = require('googleapis');
const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

const User = require('../models/User');
const googleAuthService = require('../services/googleAuthService');
const microsoftAuthService = require('../services/microsoftAuthService');

const getEmails = async (req, res) => {
    try {
        let provider, accessToken;

        // 1. Try to get tokens from session first (from temporary OAuth login)
        if (req.session && req.session.emailTokens) {
            provider = req.session.emailTokens.provider;
            accessToken = req.session.emailTokens.accessToken;
        }

        // 2. If not in session, check User's persistent integrations
        if (!accessToken && req.user) {
            const user = await User.findById(req.user.id);
            if (user?.integrations?.google?.connected) {
                provider = 'google';
                accessToken = await googleAuthService.getAccessToken(user._id, user);
            } else if (user?.integrations?.microsoft?.connected) {
                provider = 'microsoft';
                accessToken = await microsoftAuthService.getAccessToken(user._id, user);
            }
        }

        if (!accessToken) {
            return res.status(401).json({ message: 'Unauthorized: No email workspace connected' });
        }

        if (provider === 'google') {
            const oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET
            );
            oauth2Client.setCredentials({ access_token: accessToken });
            const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

            const response = await gmail.users.messages.list({ userId: 'me', maxResults: 20 });
            const messages = response.data.messages || [];

            const emailDetails = await Promise.all(messages.map(async (msg) => {
                const mail = await gmail.users.messages.get({ userId: 'me', id: msg.id, format: 'full' });
                const headers = mail.data.payload.headers;
                const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
                const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
                const date = headers.find(h => h.name === 'Date')?.value || '';

                return {
                    id: mail.data.id,
                    snippet: mail.data.snippet,
                    subject,
                    from,
                    date
                };
            }));

            return res.json({ emails: emailDetails, provider: 'google' });
        } else if (provider === 'microsoft') {
            const client = Client.init({
                authProvider: (done) => { done(null, accessToken); }
            });

            const messages = await client.api('/me/messages')
                .top(20)
                .select('id,subject,from,bodyPreview,hasAttachments,receivedDateTime')
                .orderby('receivedDateTime desc')
                .get();

            const formattedMessages = messages.value.map(msg => ({
                id: msg.id,
                snippet: msg.bodyPreview,
                subject: msg.subject,
                from: msg.from?.emailAddress?.name || msg.from?.emailAddress?.address || 'Unknown Sender',
                date: msg.receivedDateTime
            }));

            return res.json({ emails: formattedMessages, provider: 'microsoft' });
        } else {
            return res.status(400).json({ message: 'Unknown provider' });
        }
    } catch (error) {
        console.error('Email Fetch Error:', error);
        
        // Handle Google Scope errors specifically
        if (error.code === 403 || error.status === 403 || error.message?.includes('scopes')) {
            return res.status(403).json({ 
                message: 'Insufficient permissions. Please re-connect your Google account to enable email access.',
                reconnectRequired: true
            });
        }
        
        if (error.code === 401 || (error.response && error.response.status === 401)) {
            return res.status(401).json({ message: 'Token expired or invalid. Please re-authenticate.' });
        }
        
        res.status(500).json({ message: 'Failed to fetch emails', error: error.message });
    }
};

module.exports = {
    getEmails
};
