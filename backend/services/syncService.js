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
        if (!tokens || !tokens.access_token) {
            throw new Error('No access token found');
        }

        oAuth2Client.setCredentials(tokens);

        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        // Sync range: Current time to +30 days
        const timeMin = new Date();
        const timeMax = new Date();
        timeMax.setDate(timeMax.getDate() + 30);

        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
            maxResults: 250, // Increased limit
            singleEvents: true,
            orderBy: 'startTime',
        });

        const fetchedEvents = response.data.items || [];
        console.log(`[Sync] Found ${fetchedEvents.length} calendar events for user ${userId}`);

        const fetchedEventIds = new Set();
        const savedEvents = [];

        // 1. Upsert fetched events
        for (const event of fetchedEvents) {
            fetchedEventIds.add(event.id);
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
                    hangoutLink: event.hangoutLink,
                    location: event.location,
                    status: event.status,
                    attendees: event.attendees,
                    conferenceData: event.conferenceData,
                    creator: event.creator,
                    organizer: event.organizer,
                    reminders: event.reminders
                },
                status: 'active', // Ensure status is active
                lastSynced: new Date()
            };

            await SyncedData.findOneAndUpdate(
                { userId: user._id, provider: 'google', itemType: 'calendar', externalId: event.id },
                { $set: eventData },
                { upsert: true, new: true }
            );
            savedEvents.push(eventData);
        }

        // 2. Handle Deletions: Find events in DB that are NOT in fetchedEvents but fall within the time range
        // We only check for events that are 'active' locally but missing remotely
        const eventsToDelete = await SyncedData.find({
            userId: user._id,
            provider: 'google',
            itemType: 'calendar',
            status: { $ne: 'deleted' },
            'data.start.dateTime': { $gte: timeMin.toISOString(), $lte: timeMax.toISOString() },
            externalId: { $nin: Array.from(fetchedEventIds) }
        });

        if (eventsToDelete.length > 0) {
            console.log(`[Sync] Marking ${eventsToDelete.length} events as deleted locally.`);
            const idsToDelete = eventsToDelete.map(e => e._id);
            await SyncedData.updateMany(
                { _id: { $in: idsToDelete } },
                { $set: { status: 'deleted', lastSynced: new Date() } }
            );
        }

        return { count: fetchedEvents.length, deleted: eventsToDelete.length, events: savedEvents };
    },

    // Placeholder for other sync methods (Microsoft, Email, etc.)
    init: function () {
        console.log('[SyncService] Initialized background scheduler');
    }
};

module.exports = syncService;
