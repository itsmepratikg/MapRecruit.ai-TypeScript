const express = require('express');
const router = express.Router();
const Presence = require('../models/Presence');

// 1. Update/Heartbeat Presence
router.post('/heartbeat', async (req, res) => {
    try {
        const { userId, campaignId, user, page } = req.body;

        if (!userId || !campaignId) {
            return res.status(400).json({ message: 'UserId and CampaignId are required' });
        }

        // Upsert presence info
        await Presence.findOneAndUpdate(
            { userId, campaignId },
            {
                ...user,
                userId,
                campaignId,
                page,
                lastActive: new Date()
            },
            { upsert: true, new: true }
        );

        // Fetch all active users in this campaign
        const activeSeconds = 60; // Consider active if seen in last 60s
        const cutoff = new Date(Date.now() - activeSeconds * 1000);

        const activeUsers = await Presence.find({
            campaignId,
            lastActive: { $gte: cutoff }
        });

        res.json(activeUsers);
    } catch (error) {
        console.error('Presence heartbeat error:', error);
        res.status(500).json({ message: 'Internal server error' });
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
