const { google } = require('googleapis');
const User = require('../models/User');
const SyncedData = require('../models/SyncedData');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.NODE_ENV === 'production'
    ? 'https://your-app-domain.com/auth/google/callback'
    : 'http://localhost:3000/auth/google/callback';

const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
);

const syncService = {
    /**
     * Fetches calendar events for a user from Google Calendar
     * and stores them in the SyncedData collection.
     */
    async fetchUserCalendarEvents(userId) {
        const user = await User.findById(userId);
        if (!user || !user.integrations?.google?.connected) {
            throw new Error('Google Integration not connected');
        }

        const tokens = user.integrations.google.tokens;
        oAuth2Client.setCredentials(tokens);

        // Check token expiry/refresh if needed handled by googleapis automatically 
        // if refresh_token is present, but usually explicit refresh is safer.
        // For now, assuming access_token is valid or auto-refreshed.

        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        // particular time range (e.g., next 7 days)
        const timeMin = new Date().toISOString();
        const timeMax = new Date();
        timeMax.setDate(timeMax.getDate() + 30); // Sync next 30 days

        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: timeMin,
            timeMax: timeMax.toISOString(),
            maxResults: 50,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items || [];
        console.log(`[Sync] Found ${events.length} calendar events for user ${userId}`);

        const savedEvents = [];

        for (const event of events) {
            // Upsert into SyncedData
            const eventData = {
                userId: user._id,
                provider: 'google',
                itemType: 'calendar',
                externalId: event.id,
                data: {
                    summary: event.summary,
                    description: event.description,
                    start: event.start,
                    end: event.end,
                    link: event.htmlLink,
                    location: event.location,
                    status: event.status
                },
                lastSynced: new Date()
            };

            await SyncedData.findOneAndUpdate(
                { userId: user._id, provider: 'google', itemType: 'calendar', externalId: event.id },
                eventData,
                { upsert: true, new: true }
            );
            savedEvents.push(eventData);
        }

        return { count: events.length, events: savedEvents };
    },

    // Placeholder for other sync methods (Microsoft, Email, etc.)
    init: function () {
        console.log('[SyncService] Initialized background scheduler');
    }
};

module.exports = syncService;
