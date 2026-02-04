const Interview = require('../models/Interview');
const Client = require('../models/Client');
const { sanitizeNoSQL, isValidObjectId } = require('../utils/securityUtils');

// Helper to get access filter (standardizing with profileController)
const getAccessFilter = async (user) => {
    const companyID = user.currentCompanyID || user.companyID;
    const activeClientID = user.activeClientID;

    if (!activeClientID) {
        return { companyID };
    }

    try {
        const client = await Client.findById(activeClientID);
        const searchLevel = client?.settings?.profileSearchAccessLevel || 'Client';

        if (searchLevel === 'Company') {
            return { companyID };
        } else {
            return { clientID: activeClientID.toString() };
        }
    } catch (error) {
        console.error('Error fetching client access level:', error);
        return { companyID };
    }
};

// @desc    Get all interviews
// @route   GET /api/interviews
const getInterviews = async (req, res) => {
    try {
        const accessFilter = await getAccessFilter(req.user);

        // Allow filtering by resumeID or campaignID from query
        const queryFilter = { ...accessFilter };
        if (req.query.resumeID && typeof req.query.resumeID === 'string') queryFilter.resumeID = req.query.resumeID;
        if (req.query.campaignID && typeof req.query.campaignID === 'string') queryFilter.campaignID = req.query.campaignID;
        if (req.query.status && typeof req.query.status === 'string') queryFilter.status = req.query.status;

        const interviews = await Interview.find(queryFilter).sort({ createdAt: -1 });

        res.status(200).json(interviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single interview
// @route   GET /api/interviews/:id
const getInterview = async (req, res) => {
    try {
        const accessFilter = await getAccessFilter(req.user);

        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Interview ID' });
        }

        const interview = await Interview.findOne({
            _id: { $eq: req.params.id },
            ...accessFilter
        });

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found or access denied' });
        }

        res.status(200).json(interview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create interview
// @route   POST /api/interviews
const createInterview = async (req, res) => {
    try {
        // Automatically inject tenant IDs from user context
        const sanitizedBody = sanitizeNoSQL(req.body);
        const interview = await Interview.create({
            ...sanitizedBody,
            companyID: req.user.currentCompanyID || req.user.companyID,
            clientID: req.user.activeClientID,
            userID: req.user.id
        });

        res.status(201).json(interview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};



// @desc    Update interview
// @route   PUT /api/interviews/:id
// @access  Private
const updateInterview = async (req, res) => {
    try {
        const accessFilter = await getAccessFilter(req.user);

        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Interview ID' });
        }

        const interview = await Interview.findOne({
            _id: { $eq: req.params.id },
            ...accessFilter
        });

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found or access denied' });
        }

        const updates = req.body;
        const sanitizedUpdates = sanitizeNoSQL(updates);

        const updatedInterview = await Interview.findByIdAndUpdate(
            req.params.id,
            { $set: sanitizedUpdates },
            { new: true, runValidators: false }
        );

        res.status(200).json(updatedInterview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete interview (Soft Delete using linked: false)
// @route   DELETE /api/interviews/:id
const deleteInterview = async (req, res) => {
    try {
        const accessFilter = await getAccessFilter(req.user);

        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Interview ID' });
        }

        const interview = await Interview.findOne({
            _id: { $eq: req.params.id },
            ...accessFilter
        });

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found or access denied' });
        }

        // Soft delete implementation
        interview.linked = false;
        await interview.save();

        res.status(200).json({ message: 'Interview soft-deleted', id: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getInterviews,
    getInterview,
    createInterview,
    updateInterview,
    deleteInterview
};
