const mongoose = require('mongoose');

const customSectionSchema = new mongoose.Schema({
    companyID: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    clientID: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    enabled: { type: Boolean, default: true },
    default: { type: Boolean, default: false },
    campaignID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }],
    userID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    pageID: { type: String },
    page: { type: String, required: true },
    order: { type: Number, default: 1 },
    name: { type: String, required: true },
    accessLevel: { type: String, default: 'Company' },
    sectionType: { type: String, default: 'Custom' },
    editable: { type: Boolean, default: true },
    customFieldsCount: { type: Number, default: 0 }
}, {
    timestamps: true,
    collection: 'customSections'
});

module.exports = mongoose.model('CustomSection', customSectionSchema);
