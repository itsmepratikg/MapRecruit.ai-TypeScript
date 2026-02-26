const User = require('../models/User');
const googleAuthService = require('../services/googleAuthService');
const microsoftAuthService = require('../services/microsoftAuthService');
const syncService = require('../services/syncService');
require('isomorphic-fetch');

const getStatus = async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        let modified = false;

        // Proactively refresh tokens if they are close to expiring
        if (user.integrations?.google?.connected) {
            try {
                const oldToken = user.integrations.google.tokens?.access_token;
                const newToken = await googleAuthService.getAccessToken(user._id, user);
                if (oldToken !== newToken) modified = true;
            } catch (e) { console.warn('Silently failed google refresh in status'); }
        }
        if (user.integrations?.microsoft?.connected) {
            try {
                const oldToken = user.integrations.microsoft.tokens?.access_token;
                const newToken = await microsoftAuthService.getAccessToken(user._id, user);
                if (oldToken !== newToken) modified = true;
            } catch (e) { console.warn('Silently failed microsoft refresh in status'); }
        }

        // If tokens were refreshed, re-fetch just once to be safe, or just use the mutated object
        const finalUser = modified ? await User.findById(req.user.id) : user;

        res.json({
            google: {
                connected: finalUser.integrations?.google?.connected || false,
                email: finalUser.integrations?.google?.email,
                lastSynced: finalUser.integrations?.google?.lastSynced,
                validUpto: finalUser.integrations?.google?.validUpto
            },
            microsoft: {
                connected: finalUser.integrations?.microsoft?.connected || false,
                email: finalUser.integrations?.microsoft?.email,
                lastSynced: finalUser.integrations?.microsoft?.lastSynced,
                validUpto: finalUser.integrations?.microsoft?.validUpto
            }
        });
    } catch (error) {
        console.error('Failed to get integration status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const handleGoogleCallback = async (req, res) => {
    try {
        const { code, redirectUri: providedRedirectUri } = req.body;
        if (!code) return res.status(400).json({ message: 'Authorization code is required' });

        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

        // Use provided redirectUri if available, otherwise fallback to environment-based one
        const fallbackRedirectUri = process.env.NODE_ENV === 'production'
            ? 'https://your-app-domain.com/auth/google/callback'
            : 'http://localhost:3000/auth/google/callback';

        const redirectUri = providedRedirectUri || fallbackRedirectUri;

        console.log('Google Token Exchange - Code:', code ? 'Present' : 'Missing');
        console.log('Google Token Exchange - Redirect URI:', redirectUri);

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
            email: userinfo.email,
            lastSynced: new Date(),
            validUpto: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null
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

            // Soft delete synced events for this provider
            const SyncedData = require('../models/SyncedData');
            await SyncedData.updateMany(
                { userId: req.user.id, provider: provider },
                { $set: { status: 'deleted' } }
            );
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Disconnect Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getPickerToken = async (req, res) => {
    try {
        // Use service to get token (handles refresh)
        const accessToken = await googleAuthService.getAccessToken(req.user.id);
        res.json({ access_token: accessToken });
    } catch (error) {
        console.error('getPickerToken Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const fetchDriveFile = async (req, res) => {
    try {
        const { fileId, fileName, size } = req.body;
        if (!fileId) return res.status(400).json({ message: 'fileId is required' });

        // Backend 2MB check
        if (size && size > 2 * 1024 * 1024) {
            return res.status(400).json({ message: `File ${fileName} exceeds the 2MB limit.` });
        }

        const user = await User.findById(req.user.id);
        // Use service to get token (handles refresh)
        const accessToken = await googleAuthService.getAccessToken(req.user.id);
        if (!accessToken) return res.status(403).json({ message: 'Unauthorized Google Access' });

        const isTestEnv = req.headers.host.includes('localhost') || req.headers.host.includes('.vercel.app');

        if (isTestEnv) {
            const fs = require('fs');
            const path = require('path');
            const { google } = require('googleapis');

            const oauth2Client = new google.auth.OAuth2();
            oauth2Client.setCredentials({ access_token: accessToken });

            const drive = google.drive({ version: 'v3', auth: oauth2Client });

            // Check metadata if size wasn't provided
            if (!size) {
                const meta = await drive.files.get({ fileId, fields: 'size' });
                if (meta.data.size > 2 * 1024 * 1024) {
                    return res.status(400).json({ message: `File ${fileName} exceeds the 2MB limit.` });
                }
            }

            const companyId = user.company || 'default';
            const targetDir = path.join(process.cwd(), '.trash', 'Workspace', companyId.toString(), 'Google');

            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            const filePath = path.join(targetDir, fileName);
            const dest = fs.createWriteStream(filePath);

            const driveRes = await drive.files.get(
                { fileId, alt: 'media' },
                { responseType: 'stream' }
            );

            await new Promise((resolve, reject) => {
                driveRes.data
                    .on('end', resolve)
                    .on('error', reject)
                    .pipe(dest);
            });

            console.log(`[Drive] Saved ${fileName} to ${targetDir}`);
        }

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
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};

// ... (Existing controller methods)

const syncCalendar = async (req, res) => {
    try {
        const result = await syncService.fetchUserCalendarEvents(req.user.id);

        // Update lastSynced in User document
        const user = await User.findById(req.user.id);
        if (user && user.integrations?.google) {
            user.integrations.google.lastSynced = new Date();
            user.markModified('integrations');
            await user.save();
        }

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
            itemType: 'calendar',
            status: { $ne: 'deleted' }
        }).sort({ 'data.start.dateTime': 1 });

        res.json({ success: true, count: events.length, events });
    } catch (error) {
        console.error('Get Calendar Events Error:', error);
        res.status(500).json({ message: 'Failed to fetch events' });
    }
};

const createCalendarEvent = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        // Use service to get token (handles refresh)
        const accessToken = await googleAuthService.getAccessToken(req.user.id);
        if (!accessToken) return res.status(403).json({ message: 'Google not connected' });

        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                summary: req.body.summary,
                description: req.body.description,
                start: req.body.start,
                end: req.body.end,
                location: req.body.location,
                attendees: req.body.attendees?.map(email => ({ email })),
                conferenceData: req.body.createMeeting ? {
                    createRequest: { requestId: Date.now().toString(), conferenceSolutionKey: { type: 'hangoutsMeet' } }
                } : null
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        // Immediately sync this event locally
        const SyncedData = require('../models/SyncedData');
        await SyncedData.findOneAndUpdate(
            { userId: req.user.id, externalId: data.id },
            {
                userId: req.user.id,
                itemType: 'calendar',
                provider: 'google',
                externalId: data.id,
                data: data,
                lastSynced: new Date()
            },
            { upsert: true }
        );

        res.json({ success: true, event: data });
    } catch (error) {
        console.error('Create Event Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const updateCalendarEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const user = await User.findById(req.user.id);
        // Use service to get token (handles refresh)
        const accessToken = await googleAuthService.getAccessToken(req.user.id);
        if (!accessToken) return res.status(403).json({ message: 'Google not connected' });

        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}?conferenceDataVersion=1`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                summary: req.body.summary,
                description: req.body.description,
                start: req.body.start,
                end: req.body.end,
                location: req.body.location,
                attendees: req.body.attendees?.map((email) => ({ email })),
                conferenceData: req.body.createMeeting ? {
                    createRequest: { requestId: Date.now().toString(), conferenceSolutionKey: { type: 'hangoutsMeet' } }
                } : null
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        // Update local sync
        const SyncedData = require('../models/SyncedData');
        await SyncedData.findOneAndUpdate(
            { userId: req.user.id, externalId: data.id },
            { data: data, lastSynced: new Date() }
        );

        res.json({ success: true, event: data });
    } catch (error) {
        console.error('Update Event Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const deleteSpecificCalendarEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const user = await User.findById(req.user.id);
        // Use service to get token (handles refresh)
        const accessToken = await googleAuthService.getAccessToken(req.user.id);
        if (!accessToken) return res.status(403).json({ message: 'Google not connected' });

        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (response.status !== 204 && response.status !== 200) {
            const data = await response.json();
            throw new Error(data.error?.message || 'Delete failed');
        }

        // Remove from local sync
        const SyncedData = require('../models/SyncedData');
        await SyncedData.deleteOne({ userId: req.user.id, externalId: eventId });

        res.json({ success: true });
    } catch (error) {
        console.error('Delete Event Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const fetchMicrosoftFile = async (req, res) => {
    try {
        const { resourceId, siteId, fileName, size } = req.body;
        if (!resourceId) return res.status(400).json({ message: 'resourceId is required' });

        // Backend 2MB check
        if (size && size > 2 * 1024 * 1024) {
            return res.status(400).json({ message: `File ${fileName} exceeds the 2MB limit.` });
        }

        const user = await User.findById(req.user.id);
        // Use service to get token (handles refresh)
        const accessToken = await microsoftAuthService.getAccessToken(req.user.id);
        if (!accessToken) return res.status(403).json({ message: 'Unauthorized Microsoft Access' });

        const isTestEnv = req.headers.host.includes('localhost') || req.headers.host.includes('.vercel.app');

        if (isTestEnv) {
            const fs = require('fs');
            const path = require('path');
            const axios = require('axios');

            // 1. Get download URL from Graph
            const graphUrl = siteId
                ? `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${resourceId}`
                : `https://graph.microsoft.com/v1.0/me/drive/items/${resourceId}`;

            const metaResponse = await axios.get(graphUrl, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            const downloadUrl = metaResponse.data['@microsoft.graph.downloadUrl'];
            const fileSize = metaResponse.data.size;

            if (fileSize > 2 * 1024 * 1024) {
                return res.status(400).json({ message: `File ${fileName} exceeds the 2MB limit.` });
            }

            if (!downloadUrl) throw new Error('Could not get download URL from Microsoft Graph');

            const companyId = user.company || 'default';
            const targetDir = path.join(process.cwd(), '.trash', 'Workspace', companyId.toString(), 'Microsoft');

            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            const filePath = path.join(targetDir, fileName);
            const dest = fs.createWriteStream(filePath);

            const downloadRes = await axios.get(downloadUrl, { responseType: 'stream' });

            await new Promise((resolve, reject) => {
                downloadRes.data
                    .on('end', resolve)
                    .on('error', reject)
                    .pipe(dest);
            });

            console.log(`[Microsoft] Saved ${fileName} to ${targetDir}`);
        }

        res.json({
            success: true,
            fileName: fileName,
            resourceId: resourceId,
            parsedData: {
                firstName: 'Alex',
                lastName: 'Microsoft',
                email: 'alex.msft@example.com',
                title: 'Solutions Architect',
                skills: 'Azure, C#, SharePoint',
                source: 'OneDrive'
            }
        });
    } catch (error) {
        console.error('fetchMicrosoftFile Error:', error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};

const handleMicrosoftCallback = async (req, res) => {
    try {
        const { code, redirectUri: providedRedirectUri, codeVerifier } = req.body;
        if (!code) return res.status(400).json({ message: 'Authorization code is required' });

        const clientId = process.env.MICROSOFT_CLIENT_ID;
        const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;

        const fallbackRedirectUri = process.env.NODE_ENV === 'production'
            ? 'https://your-app-domain.com/auth/microsoft/callback'
            : 'http://localhost:3000/auth/microsoft/callback';

        const redirectUri = providedRedirectUri || fallbackRedirectUri;

        console.log('Microsoft Token Exchange - Code:', code ? 'Present' : 'Missing');
        console.log('Microsoft Token Exchange - Redirect URI:', redirectUri);
        console.log('Microsoft Token Exchange - PKCE:', codeVerifier ? 'Enabled' : 'Disabled');

        // 1. Exchange code for tokens
        const bodyParams = {
            client_id: clientId,
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
            scope: 'openid email profile offline_access Files.Read.All Calendars.ReadWrite Channel.Create ChannelMessage.Send Team.ReadBasic.All'
        };

        // For public clients using PKCE, we should NOT send the client_secret
        if (codeVerifier) {
            bodyParams.code_verifier = codeVerifier;
        } else if (clientSecret) {
            bodyParams.client_secret = clientSecret;
        }

        const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': req.headers.referer || req.headers.origin || 'http://localhost:5173'
            },
            body: new URLSearchParams(bodyParams)
        });

        const tokens = await tokenResponse.json();
        if (tokens.error) {
            console.error('Microsoft Token Exchange Error:', tokens);
            return res.status(400).json({ message: tokens.error_description || 'Failed to exchange token' });
        }

        // 2. Get User Info (Email) from Graph
        const userinfoResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: { Authorization: `Bearer ${tokens.access_token}` }
        });
        const userinfo = await userinfoResponse.json();

        // 3. Update User Document
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.integrations) user.integrations = {};
        user.integrations.microsoft = {
            connected: true,
            tokens: tokens,
            email: userinfo.mail || userinfo.userPrincipalName,
            lastSynced: new Date(),
            validUpto: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null
        };

        user.markModified('integrations');
        await user.save();

        res.json({ success: true, email: user.integrations.microsoft.email });
    } catch (error) {
        console.error('handleMicrosoftCallback Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const syncAll = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        let results = { google: null, microsoft: null };

        if (user.integrations?.google?.connected) {
            try {
                await googleAuthService.getAccessToken(user._id, user);
                // Also trigger a calendar sync since the user is explicitly asking for a sync
                try {
                    await syncService.fetchUserCalendarEvents(user._id);
                    results.google = { success: true, synced: true };
                } catch (syncErr) {
                    console.warn('Silent calendar sync failure in syncAll:', syncErr.message);
                    results.google = { success: true, synced: false };
                }
            } catch (err) {
                results.google = { success: false, error: err.message };
            }
        }

        if (user.integrations?.microsoft?.connected) {
            try {
                await microsoftAuthService.getAccessToken(user._id, user);
                // Also trigger an outlook sync
                try {
                    await syncService.fetchUserOutlookEvents(user._id);
                    results.microsoft = { success: true, synced: true };
                } catch (syncErr) {
                    console.warn('Silent outlook sync failure in syncAll:', syncErr.message);
                    results.microsoft = { success: true, synced: false };
                }
            } catch (err) {
                results.microsoft = { success: false, error: err.message };
            }
        }

        // Re-fetch final status
        const updatedUser = await User.findById(req.user.id);

        res.json({
            success: true,
            results,
            status: {
                google: {
                    connected: updatedUser.integrations?.google?.connected || false,
                    validUpto: updatedUser.integrations?.google?.validUpto
                },
                microsoft: {
                    connected: updatedUser.integrations?.microsoft?.connected || false,
                    validUpto: updatedUser.integrations?.microsoft?.validUpto
                }
            }
        });
    } catch (error) {
        console.error('Manual Sync Error:', error);
        res.status(500).json({ message: 'Manual sync failed' });
    }
};

const syncProfilePhoto = async (req, res) => {
    try {
        const { provider } = req.params;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (provider === 'google') {
            const accessToken = await googleAuthService.getAccessToken(user._id, user);
            const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const userinfo = await userinfoResponse.json();
            if (userinfo.picture) {
                return res.json({ photoUrl: userinfo.picture });
            }
        } else if (provider === 'microsoft') {
            const accessToken = await microsoftAuthService.getAccessToken(user._id, user);
            const photoResponse = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (photoResponse.ok) {
                const buffer = await photoResponse.arrayBuffer();
                const base64 = Buffer.from(buffer).toString('base64');
                const contentType = photoResponse.headers.get('content-type') || 'image/jpeg';
                return res.json({ photoUrl: `data:${contentType};base64,${base64}` });
            }
        }

        res.status(400).json({ message: 'Could not fetch profile photo from provider. Ensure it is set there.' });
    } catch (error) {
        console.error('Sync Profile Photo Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {

    getStatus,
    handleGoogleCallback,
    handleMicrosoftCallback,
    disconnect,
    getPickerToken,
    fetchDriveFile,
    fetchMicrosoftFile,
    syncCalendar,
    getCalendarEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteSpecificCalendarEvent,
    syncAll,
    syncProfilePhoto
};

