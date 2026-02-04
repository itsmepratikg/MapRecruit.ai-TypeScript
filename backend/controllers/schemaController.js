const Schema = require('../models/Schema');

// @desc    Get schema by name
// @route   GET /api/schemas/:name
// @access  Private
exports.getSchemaByName = async (req, res) => {
    try {
        const schema = await Schema.findOne({ name: req.params.name });

        if (!schema) {
            return res.status(404).json({ message: `Schema '${req.params.name}' not found` });
        }

        res.json(schema);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all available schema names
// @route   GET /api/schemas
// @access  Private
exports.listSchemas = async (req, res) => {
    try {
        const schemas = await Schema.find({}, 'name description');
        res.json(schemas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
