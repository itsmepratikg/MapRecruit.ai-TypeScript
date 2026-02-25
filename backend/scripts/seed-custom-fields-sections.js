require('dotenv').config();
const mongoose = require('mongoose');
const CustomSection = require('../models/CustomSection');
const CustomField = require('../models/CustomField');

const testDbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/maprecruit';

const sections = [
    {
        "_id": "621f18121e6fe269da81d310",
        "enabled": true,
        "page": "job description",
        "name": "TRC Front Office",
        "customFieldsCount": 40
    },
    {
        "_id": "6667dccf93d5c52cb126ee1d",
        "enabled": true,
        "page": "job description",
        "name": "Additional Information",
        "customFieldsCount": 5
    },
    {
        "_id": "68568987af32b1d0fac3a869",
        "enabled": false,
        "page": "job description",
        "name": "MVP Custom Fields",
        "customFieldsCount": 1
    },
    {
        "_id": "68c3b635cfe16463d23de901",
        "enabled": true,
        "page": "job description",
        "name": "Other Details",
        "customFieldsCount": 3
    }
];

const fields = [
    {
        "_id": "68c3b69f8ffead0252fd8f78",
        "collectionName": "campaigns",
        "enabled": false,
        "default": false,
        "deleted": false,
        "order": 1,
        "sectionID": "68c3b635cfe16463d23de901",
        "fieldType": "Custom",
        "name": "Industry2",
        "format": "Multi-Select",
        "itemsFormat": "Text",
        "minCharacters": 0,
        "maxCharacters": 0,
        "formID": "",
        "possibleValues": [
            "Logistics Warehouse",
            "General Services"
        ],
        "acceptedFileFormats": [],
        "defaultValue": [
            "Logistics Warehouse",
            "General Services"
        ],
        "valueLabel": "",
        "required": false,
        "filter": false,
        "searchable": false,
        "sortable": false,
        "profileCardsView": false,
        "profileView": false,
        "jobView": true,
        "jobCardsView": false,
        "tableColumnView": true,
        "editable": false,
        "dependantID": [],
        "dependantBy": "",
        "dependant": false,
        "i18nKey": "industry2"
    },
    {
        "_id": "68c3bae5f90fe43503bb7a63",
        "collectionName": "campaigns",
        "enabled": false,
        "default": false,
        "deleted": false,
        "order": 1,
        "sectionID": "68c3b635cfe16463d23de901",
        "fieldType": "Custom",
        "name": "Industry3",
        "format": "Drop Down",
        "itemsFormat": "Text",
        "minCharacters": 0,
        "maxCharacters": 0,
        "formID": "",
        "possibleValues": [
            "Logistics Warehouse",
            "General Services"
        ],
        "acceptedFileFormats": [],
        "defaultValue": "",
        "valueLabel": "",
        "required": false,
        "filter": true,
        "searchable": false,
        "sortable": false,
        "profileCardsView": true,
        "profileView": true,
        "jobView": true,
        "jobCardsView": false,
        "tableColumnView": true,
        "editable": true,
        "dependantID": [],
        "dependantBy": "",
        "dependant": false,
        "i18nKey": "industry3"
    },
    {
        "_id": "68c3bdcc8ffead0252fd8f8f",
        "collectionName": "campaigns",
        "enabled": true,
        "default": false,
        "deleted": false,
        "order": 1,
        "sectionID": "68c3b635cfe16463d23de901",
        "fieldType": "Custom",
        "name": "Industry",
        "format": "List",
        "itemsFormat": "Text",
        "minCharacters": 0,
        "maxCharacters": 0,
        "formID": "",
        "possibleValues": [],
        "acceptedFileFormats": [],
        "defaultValue": [],
        "valueLabel": "",
        "required": false,
        "filter": true,
        "searchable": false,
        "sortable": false,
        "profileCardsView": true,
        "profileView": true,
        "jobView": true,
        "jobCardsView": false,
        "tableColumnView": true,
        "editable": true,
        "dependantID": [],
        "dependantBy": "",
        "dependant": false,
        "i18nKey": "industry"
    },
    {
        "_id": "688b3c552ec6736e21c72d25",
        "collectionName": "campaigns",
        "enabled": true,
        "default": false,
        "deleted": false,
        "order": 1,
        "sectionID": "68568987af32b1d0fac3a869",
        "fieldType": "Custom",
        "name": "Child Account Names",
        "format": "List",
        "itemsFormat": "Text",
        "minCharacters": 0,
        "maxCharacters": 0,
        "formID": "",
        "possibleValues": [],
        "acceptedFileFormats": [],
        "defaultValue": [],
        "valueLabel": "",
        "required": false,
        "filter": false,
        "searchable": false,
        "sortable": false,
        "profileCardsView": false,
        "profileView": false,
        "jobView": true,
        "jobCardsView": false,
        "tableColumnView": true,
        "editable": true,
        "dependantID": [],
        "dependantBy": "",
        "dependant": false,
        "i18nKey": "childAccountNames"
    }
];

mongoose.connect(testDbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("Connected to MongoDB for seeding Custom Fields");

    try {
        await CustomSection.deleteMany({ _id: { $in: sections.map(s => s._id) } });
        await CustomField.deleteMany({ _id: { $in: fields.map(f => f._id) } });

        await CustomSection.insertMany(sections);
        // Note: the original JSON has "collection": "campaigns". I renamed it to "collectionName" mapped to 'collection' in DB or just use 'collectionName' everywhere for safety, but since I defined the model with `customFieldSchema.path('collection', String);`, let's map it there.
        const mappedFields = fields.map(f => ({
            ...f,
            collection: f.collectionName
        }));
        await CustomField.insertMany(mappedFields);

        console.log("Seeding complete.");
    } catch (err) {
        console.error("Error seeding", err);
    } finally {
        mongoose.connection.close();
    }
}).catch(err => {
    console.error("MongoDB connection error:", err);
});
