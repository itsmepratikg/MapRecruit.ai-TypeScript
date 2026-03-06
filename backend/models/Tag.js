const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    name: { type: String, required: true },
    color: { type: String, default: '#000000' },
    active: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customData: mongoose.Schema.Types.Mixed
}, {
    timestamps: true,
    strict: false,
    collection: 'tags'
});

const Tag = mongoose.model('Tag', tagSchema, 'tags');

module.exports = Tag;
