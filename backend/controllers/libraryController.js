const Library = require('../models/Library');
const mongoose = require('mongoose');

// @desc    Get all library items
// @route   GET /api/library
// @access  Private
const getLibraryItems = async (req, res) => {
    try {
        const companyID = req.user.currentCompanyID || req.user.companyID;
        const { type, search } = req.query;

        const query = {
            companyID: new mongoose.Types.ObjectId(companyID)
        };

        if (type && typeof type === 'string') {
            query.type = type;
        }

        if (search && typeof search === 'string') {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'metaData.shortcode': { $regex: search, $options: 'i' } }
            ];
        }

        const items = await Library.find(query).sort({ updatedAt: -1 });
        res.status(200).json(items);
    } catch (error) {
        console.error('getLibraryItems Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a library item
// @route   POST /api/library
// @access  Private
const createLibraryItem = async (req, res) => {
    try {
        const companyID = req.user.currentCompanyID || req.user.companyID;
        const item = await Library.create({
            ...req.body,
            companyID: new mongoose.Types.ObjectId(companyID),
            createdBy: req.user.id
        });
        res.status(201).json(item);
    } catch (error) {
        console.error('createLibraryItem Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a library item
// @route   PUT /api/library/:id
// @access  Private
const updateLibraryItem = async (req, res) => {
    try {
        const item = await Library.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Verify company ownership
        const companyID = (req.user.currentCompanyID || req.user.companyID).toString();
        if (item.companyID.toString() !== companyID) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Prevent NoSQL operator injection
        const updates = { ...req.body };
        Object.keys(updates).forEach(key => {
            if (key.startsWith('$')) delete updates[key];
        });

        const updatedItem = await Library.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
        );

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('updateLibraryItem Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a library item
// @route   DELETE /api/library/:id
// @access  Private
const deleteLibraryItem = async (req, res) => {
    try {
        const item = await Library.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        const companyID = (req.user.currentCompanyID || req.user.companyID).toString();
        if (item.companyID.toString() !== companyID) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await item.deleteOne();
        res.status(200).json({ message: 'Item removed' });
    } catch (error) {
        console.error('deleteLibraryItem Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getLibraryItems,
    createLibraryItem,
    updateLibraryItem,
    deleteLibraryItem
};
