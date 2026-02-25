const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// A dedicated secret for Google Chat linking. In production, use process.env.CHAT_LINK_SECRET
const CHAT_SECRET = process.env.JWT_SECRET || 'fallback_chat_dev_secret_maprecruit';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// 1. Webhook endpoint from Google Chat
// Google Chat sends events like ADDED_TO_SPACE or MESSAGE
router.post('/webhook', async (req, res) => {
    try {
        const payload = req.body;

        if (payload.type === 'ADDED_TO_SPACE') {
            const spaceName = payload.space.name;
            const displayName = payload.space.displayName || 'a Direct Message';

            // Generate a secure one-time-use Magic Link Token that expires in 15 mins
            const linkToken = jwt.sign(
                { spaceId: spaceName, spaceDisplayName: displayName },
                CHAT_SECRET,
                { expiresIn: '15m' }
            );

            // Deep Link to frontend linking page
            const linkUrl = `${FRONTEND_URL}/usernotifications/googlechat?token=${linkToken}`;

            // Build the Google Chat Card response
            const cardMessage = {
                cardsV2: [{
                    cardId: 'linkCard',
                    card: {
                        header: {
                            title: 'Welcome to MapRecruit AI!',
                            subtitle: 'Connect this space to your account',
                            imageUrl: 'https://cdn-icons-png.flaticon.com/512/2965/2965306.png',
                            imageType: 'CIRCLE'
                        },
                        sections: [{
                            widgets: [
                                {
                                    textParagraph: {
                                        text: `Hello! To enable notifications and AI actions in **${displayName}**, please link your account.`
                                    }
                                },
                                {
                                    buttonList: {
                                        buttons: [{
                                            text: 'Link MapRecruit Account',
                                            onClick: {
                                                openLink: {
                                                    url: linkUrl
                                                }
                                            }
                                        }]
                                    }
                                }
                            ]
                        }]
                    }
                }]
            };

            return res.json(cardMessage);
        } else if (payload.type === 'MESSAGE') {
            return res.json({ text: "I'm the MapRecruit bot! Please configure my integration from your dashboard to enable features." });
        }

        // Acknowledge other events quietly
        return res.status(200).send();
    } catch (error) {
        console.error('Webhook processing error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 2. Endpoint to handle the actual linking (Called by frontend after user clicks link and is authenticated)
router.post('/link', async (req, res) => {
    try {
        const { token, userId } = req.body; // Expect frontend to send token and the logged in user ID

        if (!token || !userId) {
            return res.status(400).json({ success: false, message: 'Missing token or user ID' });
        }

        // Verify token
        const decoded = jwt.verify(token, CHAT_SECRET);
        const { spaceId } = decoded;

        // Update user record
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 'integrations.google.chatSpaceId': spaceId },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.json({ success: true, message: 'Google Chat linked successfully.', spaceId });

    } catch (error) {
        console.error('Chat linking error:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ success: false, message: 'The link has expired. Please type @MapRecruitBot again.' });
        }
        return res.status(500).json({ success: false, message: 'Failed to link account.' });
    }
});

module.exports = router;
