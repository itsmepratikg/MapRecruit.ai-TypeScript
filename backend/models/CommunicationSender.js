
const mongoose = require('mongoose');

const communicationSenderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    provider: { type: String, required: true },
    channel: { type: String, enum: ['Email', 'SMS', 'Phone'], required: true },
    companyID: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    clientID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }],
    userID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    email: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    internationalCode: { type: String, default: '' },
    postmark: {
        signatureVerified: { type: Boolean, default: false },
        signatureID: { type: String, default: '' }
    },
    auth: { type: mongoose.Schema.Types.Mixed }, // flexible for different provider auth needs
    active: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    default: { type: Boolean, default: false },
    module: { type: String, default: 'ReachOut' },
    senderSignature: { type: String, default: '' },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true,
    collection: 'communicationSender'
});

// Indexing for faster lookups
communicationSenderSchema.index({ companyID: 1 });
communicationSenderSchema.index({ channel: 1 });

module.exports = mongoose.model('CommunicationSender', communicationSenderSchema);
