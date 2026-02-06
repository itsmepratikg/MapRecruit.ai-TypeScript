const mongoose = require('mongoose');

const syncedDataSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    provider: {
        type: String,
        enum: ['google', 'microsoft'],
        required: true
    },
    itemType: {
        type: String,
        enum: ['gmail', 'calendar', 'outlook', 'teams'],
        required: true
    },
    externalId: {
        type: String,
        required: true,
        index: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    lastSynced: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index for quick lookups and avoiding duplicates
syncedDataSchema.index({ userId: 1, provider: 1, itemType: 1, externalId: 1 }, { unique: true });

const SyncedData = mongoose.model('SyncedData', syncedDataSchema);

module.exports = SyncedData;
