const mongoose = require('mongoose');

const customFieldSchema = new mongoose.Schema({
    collectionName: { type: String }, // 'collection' might be a reserved keyword in some contexts, but Schema can handle it
    enabled: { type: Boolean, default: true },
    default: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    order: { type: Number, default: 1 },
    sectionID: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomSection', required: true },
    fieldType: { type: String },
    name: { type: String, required: true },
    format: { type: String, required: true },
    itemsFormat: { type: String },
    minCharacters: { type: Number, default: 0 },
    maxCharacters: { type: Number, default: 0 },
    formID: { type: String },
    possibleValues: [{ type: String }],
    acceptedFileFormats: [{ type: String }],
    defaultValue: { type: mongoose.Schema.Types.Mixed },
    valueLabel: { type: String },
    required: { type: Boolean, default: false },
    filter: { type: Boolean, default: false },
    searchable: { type: Boolean, default: false },
    sortable: { type: Boolean, default: false },
    profileCardsView: { type: Boolean, default: false },
    profileView: { type: Boolean, default: false },
    jobView: { type: Boolean, default: false },
    jobCardsView: { type: Boolean, default: false },
    tableColumnView: { type: Boolean, default: false },
    editable: { type: Boolean, default: false },
    dependantID: [{ type: String }],
    dependantBy: { type: String },
    dependant: { type: Boolean, default: false },
    i18nKey: { type: String }
}, {
    timestamps: true,
    collection: 'customFields'
});

// Since the JSON has "collection" as a field, let's use an alias or map it in the schema, 
// actually Mongoose allows 'collection' as a path name, but to be sure we can set it up carefully.
customFieldSchema.path('collection', String);

module.exports = mongoose.model('CustomField', customFieldSchema);
