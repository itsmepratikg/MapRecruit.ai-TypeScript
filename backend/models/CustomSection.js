const mongoose = require('mongoose');

const customSectionSchema = new mongoose.Schema({
    companyID: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    enabled: { type: Boolean, default: true },
    page: { type: String, required: true },
    name: { type: String, required: true },
    customFieldsCount: { type: Number, default: 0 }
}, {
    timestamps: true,
    collection: 'customSections'
});

module.exports = mongoose.model('CustomSection', customSectionSchema);
