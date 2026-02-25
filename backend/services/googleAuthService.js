const User = require('../models/User');
const { google } = require('googleapis');

const googleAuthService = {
    /**
     * Retrieves a valid access token for the user, refreshing it if necessary.
     */
    async getAccessToken(userId, preFetchedUser = null) {
        const user = preFetchedUser || await User.findById(userId);
        if (!user || !user.integrations?.google?.connected) {
            if (preFetchedUser) return null; // Don't throw if we're just checking status
            throw new Error('Google integration not connected');
        }

        const tokens = user.integrations.google.tokens;
        if (!tokens || !tokens.access_token) {
            throw new Error('No Google access token found');
        }

        // Check if token is expired or about to expire (within 5 minutes)
        const now = Date.now();
        // Google tokens usually have expiry_date (timestamp)
        const expiryDate = tokens.expiry_date || (user.integrations.google.validUpto ? new Date(user.integrations.google.validUpto).getTime() : 0);

        if (expiryDate > (now + 300000)) {
            return tokens.access_token;
        }

        console.log(`[GoogleAuth] Token expired for user ${userId}. Refreshing...`);
        return await this.refreshAccessToken(user, tokens.refresh_token);
    },

    async refreshAccessToken(user, refreshToken) {
        if (!refreshToken) {
            console.error('No refresh token available for Google user', user._id);
            throw new Error('No refresh token available');
        }

        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );

        oAuth2Client.setCredentials({
            refresh_token: refreshToken
        });

        try {
            const { credentials } = await oAuth2Client.refreshAccessToken();

            // Update User
            user.integrations.google.tokens = {
                ...user.integrations.google.tokens,
                ...credentials
            };
            // Google credentials include expiry_date
            user.integrations.google.validUpto = new Date(credentials.expiry_date);
            user.integrations.google.lastSynced = new Date();

            user.markModified('integrations');
            await user.save();

            console.log(`[GoogleAuth] Token refreshed successfully for user ${user._id}`);
            return credentials.access_token;
        } catch (error) {
            console.error('[GoogleAuth] Refresh failed:', error.message);

            if (error.message.includes('invalid_grant')) {
                console.log(`[GoogleAuth] Invalid grant. Disconnecting user ${user._id}`);
                user.integrations.google.connected = false;
                user.markModified('integrations');
                await user.save();
            }

            throw new Error('Failed to refresh Google token');
        }
    }
};

module.exports = googleAuthService;
