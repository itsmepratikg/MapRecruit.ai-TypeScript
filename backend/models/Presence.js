const mongoose = require('mongoose');

const PresenceSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    firstName: String,
    lastName: String,
    avatar: String,
    color: String,
    email: String,
    campaignId: {
        type: String,
        required: true,
        index: true
    },
    page: String,
    lastActive: {
        type: Date,
        default: Date.now,
        index: { expires: '2m' } // Automatically remove documents after 2 minutes of inactivity
    }
}, { timestamps: true });

// Ensure we only have one presence record per user
PresenceSchema.index({ userId: 1, campaignId: 1 }, { unique: true });

module.exports = mongoose.model('Presence', PresenceSchema);
