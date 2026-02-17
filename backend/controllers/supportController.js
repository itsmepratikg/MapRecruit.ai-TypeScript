const Company = require('../models/Company');
const User = require('../models/User');

const getValidGoogleToken = async (user) => {
    if (!user.integrations?.google?.connected) return null;

    const tokens = user.integrations.google.tokens;
    const isExpired = tokens.expiry_date ? (Date.now() > (tokens.expiry_date - 60000)) : true;

    if (!isExpired) return tokens.access_token;

    if (!tokens.refresh_token) return null;

    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                refresh_token: tokens.refresh_token,
                grant_type: 'refresh_token'
            })
        });

        const newTokens = await response.json();
        if (newTokens.error) {
            console.error('Failed to refresh Google token for support alert:', newTokens);
            return null;
        }

        // Update user tokens
        user.integrations.google.tokens = {
            ...user.integrations.google.tokens,
            ...newTokens,
            expiry_date: Date.now() + (newTokens.expires_in * 1000)
        };
        user.markModified('integrations');
        await user.save();

        return newTokens.access_token;
    } catch (error) {
        console.error('Error refreshing Google token:', error);
        return null;
    }
};

const submitSupportRequest = async (req, res) => {
    try {
        const { content, currentUrl, screenshot } = req.body;
        const user = await User.findById(req.user.id);
        const company = await Company.findById(user.companyID);

        // 1. Post to Google Chat if space ID exists
        const spaceId = company.googleChatAlertSpaceId || company.googleChatAlertSpaceGroup; // Handle both names

        let chatSent = false;
        if (spaceId) {
            const accessToken = await getValidGoogleToken(user);
            if (accessToken) {
                // Remove HTML tags for chat preview or better, use structured data
                // We'll send a simple text version + structured card
                const plainText = content.replace(/<[^>]*>?/gm, '').substring(0, 500);

                const card = {
                    cardsV2: [{
                        cardId: "supportTicket",
                        card: {
                            header: {
                                title: "New Support Ticket",
                                subtitle: `From: ${user.firstName} ${user.lastName} (${user.email})`,
                                imageUrl: "https://fonts.gstatic.com/s/i/googlematerialicons/report_problem/v12/24px.svg",
                            },
                            sections: [
                                {
                                    header: "Issue Details",
                                    widgets: [
                                        { textParagraph: { text: plainText } },
                                        {
                                            decoratedText: {
                                                topLabel: "URL",
                                                text: currentUrl,
                                                button: {
                                                    text: "Open Page",
                                                    onClick: { openLink: { url: currentUrl } }
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    }]
                };

                const chatResponse = await fetch(`https://chat.googleapis.com/v1/spaces/${spaceId}/messages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(card)
                });

                if (chatResponse.ok) {
                    chatSent = true;
                    console.log('Support ticket posted to Google Chat successfully');
                } else {
                    const errData = await chatResponse.json();
                    console.error('Failed to post to Google Chat:', errData);
                }
            }
        }

        res.json({
            success: true,
            message: chatSent ? 'Support request submitted and alert sent to Google Chat.' : 'Support request received.'
        });
    } catch (error) {
        console.error('Support submission error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    submitSupportRequest
};
