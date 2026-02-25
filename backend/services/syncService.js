const { google } = require('googleapis');
const cron = require('node-cron');
const microsoftAuthService = require('./microsoftAuthService');
const User = require('../models/User');
const SyncedData = require('../models/SyncedData');

const googleAuthService = require('./googleAuthService');

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

        const accessToken = await googleAuthService.getAccessToken(userId);

        const oAuth2Client = new google.auth.OAuth2();
        oAuth2Client.setCredentials({ access_token: accessToken });

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

    /**
     * Fetches calendar events for a user from Microsoft Outlook
     * and stores them in the SyncedData collection.
     */
    async fetchUserOutlookEvents(userId) {
        const user = await User.findById(userId);
        if (!user || !user.integrations?.microsoft?.connected) {
            throw new Error('Microsoft Integration not connected');
        }

        const accessToken = await microsoftAuthService.getAccessToken(userId);

        // Sync range: Current time to +30 days
        const timeMin = new Date();
        const timeMax = new Date();
        timeMax.setDate(timeMax.getDate() + 30);

        try {
            const axios = require('axios');
            const response = await axios.get(
                `https://graph.microsoft.com/v1.0/me/calendar/calendarView?startDateTime=${timeMin.toISOString()}&endDateTime=${timeMax.toISOString()}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
            );

            const fetchedEvents = response.data.value || [];
            console.log(`[Sync-Outlook] Found ${fetchedEvents.length} events for user ${userId}`);

            const fetchedEventIds = new Set();
            const savedEvents = [];

            for (const event of fetchedEvents) {
                fetchedEventIds.add(event.id);
                const eventData = {
                    userId: user._id,
                    provider: 'microsoft',
                    itemType: 'calendar',
                    externalId: event.id,
                    data: {
                        summary: event.subject,
                        description: event.bodyPreview,
                        start: { dateTime: event.start.dateTime, timeZone: event.start.timeZone },
                        end: { dateTime: event.end.dateTime, timeZone: event.end.timeZone },
                        link: event.webLink,
                        location: event.location?.displayName,
                        status: event.showAs,
                        attendees: event.attendees?.map(a => ({ email: a.emailAddress.address, responseStatus: a.status.response })),
                        organizer: { email: event.organizer?.emailAddress?.address }
                    },
                    status: 'active',
                    lastSynced: new Date()
                };

                await SyncedData.findOneAndUpdate(
                    { userId: user._id, provider: 'microsoft', itemType: 'calendar', externalId: event.id },
                    { $set: eventData },
                    { upsert: true, new: true }
                );
                savedEvents.push(eventData);
            }

            // Handle Deletions
            const eventsToDelete = await SyncedData.find({
                userId: user._id,
                provider: 'microsoft',
                itemType: 'calendar',
                status: { $ne: 'deleted' },
                externalId: { $nin: Array.from(fetchedEventIds) }
            });

            if (eventsToDelete.length > 0) {
                const idsToDelete = eventsToDelete.map(e => e._id);
                await SyncedData.updateMany(
                    { _id: { $in: idsToDelete } },
                    { $set: { status: 'deleted', lastSynced: new Date() } }
                );
            }

            return { count: fetchedEvents.length, deleted: eventsToDelete.length, events: savedEvents };
        } catch (error) {
            console.error('[Sync-Outlook] Error:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Background job to keep all user integrations alive.
     * This ensures that refresh tokens don't expire due to inactivity (e.g., long holidays).
     */
    async keepAliveIntegrations() {
        console.log('[Keep-Alive] Starting daily integration refresh check...');
        try {
            const users = await User.find({
                $or: [
                    { 'integrations.google.connected': true },
                    { 'integrations.microsoft.connected': true }
                ]
            });

            console.log(`[Keep-Alive] Found ${users.length} users with active integrations.`);

            for (const user of users) {
                if (user.integrations?.google?.connected) {
                    try {
                        await googleAuthService.getAccessToken(user._id, user);
                        await this.fetchUserCalendarEvents(user._id);
                    } catch (err) {
                        console.error(`[Keep-Alive] Google refresh failed for ${user.email}:`, err.message);
                    }
                }
                if (user.integrations?.microsoft?.connected) {
                    try {
                        await microsoftAuthService.getAccessToken(user._id, user);
                        await this.fetchUserOutlookEvents(user._id);
                    } catch (err) {
                        console.error(`[Keep-Alive] Microsoft refresh failed for ${user.email}:`, err.message);
                    }
                }
            }
            console.log('[Keep-Alive] Daily refresh check completed.');
        } catch (error) {
            console.error('[Keep-Alive] Fatal background job error:', error);
        }
    },

    // Placeholder for other sync methods (Microsoft, Email, etc.)
    init: function () {
        console.log('[SyncService] Initialized background scheduler');

        // Schedule daily keep-alive at 5:00 AM and 5:00 PM local time
        // 0 5,17 * * * means: 0th minute, 5th and 17th (5 PM) hour, every day.
        cron.schedule('0 5,17 * * *', () => {
            this.keepAliveIntegrations();
        });
    }
};

module.exports = syncService;
