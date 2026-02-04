const mongoose = require('mongoose');

const schemaDefinition = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    config: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    description: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'schemas'
});

module.exports = mongoose.model('Schema', schemaDefinition);
