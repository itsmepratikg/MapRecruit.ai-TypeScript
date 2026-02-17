const User = require('../models/User');
const axios = require('axios');

const microsoftAuthService = {
    /**
     * Retrieves a valid access token for the user, refreshing it if necessary.
     */
    async getAccessToken(userId) {
        const user = await User.findById(userId);
        if (!user || !user.integrations?.microsoft?.connected) {
            throw new Error('Microsoft integration not connected');
        }

        const tokens = user.integrations.microsoft.tokens;
        if (!tokens || !tokens.access_token) {
            throw new Error('No Microsoft access token found');
        }

        // Check if token is expired or about to expire (within 5 minutes)
        const now = Date.now();
        // Use 'validUpto' if available, otherwise check expires_in if we had it but we rely on validUpto
        let validUpto = user.integrations.microsoft.validUpto;

        // If 'validUpto' is missing, assume valid for now or extract from tokens if possible (usually not persistent)
        // If it's there, check it.
        if (validUpto && new Date(validUpto).getTime() > (now + 300000)) {
            return tokens.access_token;
        }

        console.log(`[MicrosoftAuth] Token expired or missing validUpto for user ${userId}. Refreshing...`);
        return await this.refreshAccessToken(user, tokens.refresh_token);
    },

    async refreshAccessToken(user, refreshToken) {
        if (!refreshToken) {
            console.error('No refresh token available for user', user._id);
            throw new Error('No refresh token available');
        }

        const clientId = process.env.MICROSOFT_CLIENT_ID;
        const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;

        try {
            const params = new URLSearchParams();
            params.append('client_id', clientId);
            params.append('grant_type', 'refresh_token');
            params.append('refresh_token', refreshToken);
            params.append('scope', 'openid email profile offline_access Files.Read.All Calendars.ReadWrite Channel.Create ChannelMessage.Send Team.ReadBasic.All');

            if (clientSecret) {
                params.append('client_secret', clientSecret);
            }

            const response = await axios.post(
                'https://login.microsoftonline.com/common/oauth2/v2.0/token',
                params,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );

            const newTokens = response.data;

            // Validate response
            if (!newTokens.access_token) {
                throw new Error('No access token in refresh response');
            }

            // Update User
            // Merge new tokens with old
            const updatedTokens = {
                ...user.integrations.microsoft.tokens,
                ...newTokens
            };

            user.integrations.microsoft.tokens = updatedTokens;
            user.integrations.microsoft.validUpto = new Date(Date.now() + (newTokens.expires_in * 1000));
            user.integrations.microsoft.lastSynced = new Date();

            user.markModified('integrations');
            await user.save();

            console.log(`[MicrosoftAuth] Token refreshed successfully for user ${user._id}`);
            return newTokens.access_token;
        } catch (error) {
            console.error('[MicrosoftAuth] Refresh failed:', error.response?.data || error.message);

            // If invalid_grant, disconnect
            if (error.response?.data?.error === 'invalid_grant') {
                console.log(`[MicrosoftAuth] Invalid grant. Disconnecting user ${user._id}`);
                user.integrations.microsoft.connected = false;
                user.markModified('integrations');
                await user.save();
            }

            throw new Error('Failed to refresh Microsoft token');
        }
    }
};

module.exports = microsoftAuthService;
