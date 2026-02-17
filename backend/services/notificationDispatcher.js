const User = require('../models/User');
const teamsGraphService = require('./teamsGraphService');

// Map internal event IDs to schema IDs from UserNotifications.tsx
const EVENT_MAPPING = {
    'INTERVIEW_SCHEDULED': 'int_reminder_person',
    'INTERVIEW_COMPLETED': 'int_completed',
    'CAMPAIGN_CREATED': 'camp_created',
    'CAMPAIGN_CLOSED': 'camp_closed',
    // Add more as needed
};

const notificationDispatcher = {
    /**
     * Dispatches a notification to external channels based on user preferences.
     * @param {string} userId - Recipient User ID
     * @param {string} eventType - Internal Event Type (e.g. 'CAMPAIGN_CREATED')
     * @param {object} payload - Data for the notification (title, message, link)
     */
    async dispatch(userId, eventType, payload) {
        try {
            const user = await User.findById(userId);
            if (!user) return;

            // 1. Check User Preferences
            // Default to 'APP' (App Only) if settings are missing, to avoid spam
            // Mapping: 'notificationSettings.camp_created' -> 'ALL' | 'CHAT' | 'APP' | 'NONE'

            const settingKey = EVENT_MAPPING[eventType];
            if (!settingKey) {
                console.warn(`[Notification] No mapping found for event ${eventType}`);
                return;
            }

            // If user has no settings object, assume 'APP' default for all (safe fallback)
            const userSettings = user.notificationSettings || {};
            const preference = userSettings[settingKey] || 'APP';

            console.log(`[Notification] Event: ${eventType}, Key: ${settingKey}, Pref: ${preference}`);

            // 2. Route based on Preference
            if (preference === 'ALL' || preference === 'CHAT') {
                await this.sendToTeams(user, payload);
            }

            // 'APP' and 'ALL' are handled by the frontend picking up the standard notification/socket event
            // This dispatcher focuses on *external* pushes.

        } catch (error) {
            console.error('[Notification] Dispatch failed:', error);
        }
    },

    async sendToTeams(user, payload) {
        if (!user.integrations?.microsoft?.connected) return;

        // Strategy: 
        // 1. Find a "MapRecruit Notifications" channel in their first team? 
        // 2. Or just send to the "General" channel of their first team?
        // 3. Or DM? (Sending to user requires different permissions usually, checking)
        // Plan says: "Create Channel" logic.

        // For simplicity in Phase 1: Try to find a team and post to 'General'.
        // Or if 'Campaign Created', create a channel for the Campaign?

        // Let's implement a simple "Notify General" for now.
        const teams = await teamsGraphService.getJoinedTeams(user._id);
        if (teams.length === 0) return;

        const targetTeam = teams[0]; // Just pick the first one for now
        // Get channels to find General
        // Using simplified logic: We need the channel ID. 
        // Usually PrimaryChannel is available or we list.
        // Assuming we want to post to the default channel.
        // For now, let's just log that we would post.

        // Real implementation requires listing channels or knowing the ID.
        // Let's assume we post to the first team's primary channel if we can find it.
        // Or better, let's create a "MapRecruit Alerts" channel if it doesn't exist? 
        // That might be spammy.

        console.log(`[Notification] Would send to Teams Team: ${targetTeam.displayName}, Message: ${payload.message}`);

        // Example call (commented out until channel resolution logic is firm)
        // await teamsGraphService.sendChannelMessage(user._id, targetTeam.id, targetChannelId, payload.message);
    }
};

module.exports = notificationDispatcher;
