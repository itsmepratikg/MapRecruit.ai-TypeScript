const microsoftAuthService = require('./microsoftAuthService');
const axios = require('axios');

const teamsGraphService = {
    /**
     * Gets a valid access token for the user.
     * Delegates to microsoftAuthService.
     */
    async getAccessToken(userId) {
        return await microsoftAuthService.getAccessToken(userId);
    },

    /**
     * Creates a new channel in a specified Team.
     * @param {string} userId - The user performing the action
     * @param {string} teamId - The ID of the Team
     * @param {string} channelName - Name of the new channel
     * @param {string} description - Optional description
     */
    async createChannel(userId, teamId, channelName, description = '') {
        const accessToken = await this.getAccessToken(userId);

        try {
            const response = await axios.post(
                `https://graph.microsoft.com/v1.0/teams/${teamId}/channels`,
                {
                    displayName: channelName,
                    description: description,
                    membershipType: 'standard'
                },
                {
                    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
                }
            );
            console.log(`[Teams] Created channel '${channelName}' in team ${teamId}`);
            return response.data;
        } catch (error) {
            console.error('[Teams] Failed to create channel:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error?.message || 'Failed to create Teams channel');
        }
    },

    /**
     * Sends a message to a channel.
     * @param {string} userId - User ID
     * @param {string} teamId - Team ID
     * @param {string} channelId - Channel ID
     * @param {string} content - Message content (HTML supported)
     */
    async sendChannelMessage(userId, teamId, channelId, content) {
        const accessToken = await this.getAccessToken(userId);

        try {
            const response = await axios.post(
                `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/messages`,
                {
                    body: {
                        contentType: 'html',
                        content: content
                    }
                },
                {
                    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
                }
            );
            console.log(`[Teams] Message sent to channel ${channelId}`);
            return response.data;
        } catch (error) {
            console.error('[Teams] Failed to send message:', error.response?.data || error.message);
            // Don't throw for messages to avoid blocking main flows, just log
            return null;
        }
    },

    /**
     * Lists joined teams to find a suitable one.
     */
    async getJoinedTeams(userId) {
        const accessToken = await this.getAccessToken(userId);
        try {
            const response = await axios.get(
                `https://graph.microsoft.com/v1.0/me/joinedTeams`,
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );
            return response.data.value;
        } catch (error) {
            console.error('[Teams] Failed to list teams:', error.response?.data || error.message);
            return [];
        }
    }
};

module.exports = teamsGraphService;
