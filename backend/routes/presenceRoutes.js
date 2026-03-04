const express = require('express');
const router = express.Router();
const Presence = require('../models/Presence');

// 1. Update/Heartbeat Presence
router.post('/heartbeat', async (req, res) => {
    try {
        const { userId, campaignId, user, page } = req.body;

        if (!userId || !campaignId) {
            console.warn('[Presence] Heartbeat rejected: Missing userId or campaignId', { userId, campaignId });
            return res.status(400).json({ message: 'UserId and CampaignId are required' });
        }

        // Defensive: Clean the user object to prevent Mongoose/Mongo internal field conflicts
        const cleanUser = { ...user };
        delete cleanUser._id;
        delete cleanUser.id;
        delete cleanUser.__v;

        // Upsert presence info
        await Presence.findOneAndUpdate(
            { userId, campaignId },
            {
                ...cleanUser,
                userId,
                campaignId,
                page,
                lastActive: new Date()
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Fetch all active users in this campaign
        // Consider active if seen in last 45s (slighter tighter than TTL to avoid lag)
        const cutoff = new Date(Date.now() - 45 * 1000);

        const activeUsers = await Presence.find({
            campaignId,
            lastActive: { $gte: cutoff }
        }).lean(); // Use lean for performance

        res.json(activeUsers);
    } catch (error) {
        console.error('[Presence] Heartbeat handler error:', error);
        res.status(500).json({
            message: 'Internal server error in presence heartbeat',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// 2. Explicit Leave
router.post('/leave', async (req, res) => {
    try {
        const { userId, campaignId } = req.body;
        await Presence.deleteOne({ userId, campaignId });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
