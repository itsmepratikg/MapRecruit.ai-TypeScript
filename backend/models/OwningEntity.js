const mongoose = require('mongoose');

const owningEntitySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    clientIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    }]
}, {
    timestamps: true,
    strict: true,
    collection: 'owningentities'
});

const OwningEntity = mongoose.model('OwningEntity', owningEntitySchema, 'owningentities');

module.exports = OwningEntity;
