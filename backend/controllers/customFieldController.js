const mongoose = require('mongoose');
const CustomField = require('../models/CustomField');
const CustomSection = require('../models/CustomSection');
const { sanitizeNoSQL } = require('../utils/securityUtils');

// @desc    Get custom fields for a specific collection
// @route   GET /api/custom-fields/:collection
// @access  Private
const getCustomFieldsByCollection = async (req, res) => {
    try {
        const companyID = req.user.currentCompanyID || req.user.companyID;
        const { collection } = req.params;

        // Map 'profile' to 'resumes' internally if needed, 
        // but let's stick to what's in the DB collectionName field
        const query = { companyID, enabled: true };
        if (collection) {
            query.collectionName = collection;
        }

        const fields = await CustomField.find(query).sort({ order: 1 }).lean();
        res.status(200).json(fields);
    } catch (error) {
        console.error('getCustomFields Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get custom sections with their fields grouped
// @route   GET /api/custom-sections/:collection
// @access  Private
const getGroupedCustomFields = async (req, res) => {
    try {
        const companyID = req.user.currentCompanyID || req.user.companyID;
        const { collection } = req.params;

        // Map collection to page identifier used in CustomSection model
        const collectionToPage = {
            'resumes': 'profile',
            'campaigns': 'jobDescription',
            'interviews': 'interview'
        };

        const page = collectionToPage[collection] || collection;

        // Fetch sections for this specific page/context
        const sections = await CustomSection.find({ companyID, page, enabled: true }).sort({ order: 1 }).lean();

        // Fetch fields for this specific collection
        const fields = await CustomField.find({ companyID, collectionName: collection, enabled: true }).sort({ order: 1 }).lean();

        const grouped = sections.map(section => ({
            ...section,
            fields: fields.filter(f => f.sectionID && f.sectionID.toString() === section._id.toString())
        })).filter(s => s.fields.length > 0);

        res.status(200).json(grouped);
    } catch (error) {
        console.error('getGroupedCustomFields Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update custom data for an entity
// @route   PUT /api/custom-fields/update/:id
// @access  Private
// This is a generic updater that can be used by profiles, campaigns, or interviews
// The frontend sends the path: customData.:sectionID.:customFieldID.value
const updateCustomDataField = async (req, res) => {
    try {
        const { id } = req.params;
        const { sectionID, fieldID, value, entityType } = req.body;
        const companyID = req.user.currentCompanyID || req.user.companyID;

        if (!sectionID || !fieldID || !entityType) {
            return res.status(400).json({ message: 'Missing required mapping IDs' });
        }

        const Model = mongoose.model(entityType); // Candidate, Campaign, Interview
        const entity = await Model.findOne({ _id: id, companyID });

        if (!entity) {
            return res.status(404).json({ message: 'Entity not found' });
        }

        // Deep merge or specific path set
        const keyPath = `customData.${sectionID}.${fieldID}.value`;

        // Mongoose findOneAndUpdate with $set for specific path
        const updatedEntity = await Model.findOneAndUpdate(
            { _id: id, companyID },
            { $set: { [keyPath]: sanitizeNoSQL(value) } },
            { new: true }
        );

        res.status(200).json(updatedEntity);
    } catch (error) {
        console.error('updateCustomDataField Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update custom data batch for an entity
// @route   POST /api/custom-fields/update-batch/:collection/:id
// @access  Private
const updateCustomDataBatch = async (req, res) => {
    try {
        const { collection, id } = req.params;
        const { customData } = req.body;
        const companyID = req.user.currentCompanyID || req.user.companyID;

        // Map collection name to Model name
        const collectionToModel = {
            'resumes': 'Candidate',
            'campaigns': 'Campaign',
            'interviews': 'Interview'
        };

        const modelName = collectionToModel[collection];
        if (!modelName) {
            return res.status(400).json({ message: 'Invalid collection type' });
        }

        const Model = mongoose.model(modelName);

        // Sanitize the whole object
        const sanitizedData = sanitizeNoSQL(customData);

        // Update the entity with the new customData map
        // Note: Using $set on 'customData' will overwrite existing fields.
        // If we want to preserve other customData sections, we might need a more granular merge
        // but usually the frontend sends the whole updated customData for these types of pages.
        const updatedEntity = await Model.findOneAndUpdate(
            { _id: id, companyID },
            { $set: { customData: sanitizedData } },
            { new: true }
        );

        if (!updatedEntity) {
            return res.status(404).json({ message: 'Entity not found' });
        }

        res.status(200).json(updatedEntity);
    } catch (error) {
        console.error('updateCustomDataBatch Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getCustomFieldsByCollection,
    getGroupedCustomFields,
    updateCustomDataField,
    updateCustomDataBatch
};
