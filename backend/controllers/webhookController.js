const User = require('../models/User');
const SyncedData = require('../models/SyncedData');

/**
 * Controller for handling external webhooks/push notifications.
 */

const handleGooglePush = async (req, res) => {
    try {
        // Google sends headers: x-goog-resource-id, x-goog-resource-state, etc.
        const resourceId = req.headers['x-goog-resource-id'];
        const resourceState = req.headers['x-goog-resource-state']; // 'exists', 'sync', etc.
        const channelId = req.headers['x-goog-channel-id'];

        console.log(`[Webhook] Received Google Push: channel=${channelId}, state=${resourceState}`);

        // 1. Identify User based on channelId (we should store this in User integrations when we call .watch())
        const user = await User.findOne({ 'integrations.google.watchChannelId': channelId });
        if (!user) {
            console.warn('[Webhook] No user found for channel:', channelId);
            return res.status(200).send(); // Always return 200 to Google
        }

        if (resourceState === 'sync') {
            console.log(`[Webhook] Sync notification for ${user.email}`);
            return res.status(200).send();
        }

        // 2. Schedule immediate sync for this user
        // In a real implementation, we would trigger the fetch logic here.
        console.log(`[Webhook] New activity detected for ${user.email}. Triggering sync...`);

        // Mock data fetch/storage
        await SyncedData.findOneAndUpdate(
            { userId: user._id, externalId: 'latest-activity', provider: 'google', itemType: 'gmail' },
            {
                data: { message: "New activity synced via webhook", timestamp: new Date() },
                lastSynced: new Date()
            },
            { upsert: true }
        );

        res.status(200).send();
    } catch (error) {
        console.error('[Webhook] handleGooglePush Error:', error);
        res.status(200).send(); // Google requires 200/204
    }
};

const handleMicrosoftPush = async (req, res) => {
    try {
        console.log('[Webhook] Received Microsoft Graph Push');
        // Validation token handle
        if (req.query.validationToken) {
            return res.status(200).send(req.query.validationToken);
        }

        // Process notification
        res.status(202).send();
    } catch (error) {
        console.error('[Webhook] handleMicrosoftPush Error:', error);
        res.status(202).send();
    }
};

module.exports = {
    handleGooglePush,
    handleMicrosoftPush
};
