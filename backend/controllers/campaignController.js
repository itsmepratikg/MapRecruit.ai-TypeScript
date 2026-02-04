const Campaign = require('../models/Campaign');
const User = require('../models/User');
const Client = require('../models/Client');
const { sanitizeNoSQL, isValidObjectId } = require('../utils/securityUtils');

// Helper to get allowed client IDs for user in current company
const getAllowedClientIds = async (userId, companyId) => {
    const user = await User.findById(userId).select('clientID');
    if (!user || !user.clientID || user.clientID.length === 0) return [];

    // Filter those client IDs that actually belong to the current company
    const validClients = await Client.find({
        _id: { $in: user.clientID },
        companyID: companyId
    }).select('_id');

    return validClients.map(c => c._id);
};

// @desc    Get all campaigns for the tenant (filtered by user access)
// @route   GET /api/campaigns
// @access  Private
const getCampaigns = async (req, res) => {
    try {
        const companyID = req.user.currentCompanyID || req.user.companyID;
        const allowedClients = await getAllowedClientIds(req.user.id, companyID);

        if (allowedClients.length === 0) {
            return res.status(200).json([]);
        }

        const campaigns = await Campaign.find({
            companyID: companyID,
            clientID: { $in: allowedClients }
        }).populate('clientID', '_id clientName name clientType clientLogo');

        res.status(200).json(campaigns);
    } catch (error) {
        console.error('getCampaigns Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get campaign statistics (counts)
// @route   GET /api/campaigns/stats
// @access  Private
const getCampaignStats = async (req, res) => {
    try {
        const companyID = req.user.currentCompanyID || req.user.companyID;
        const allowedClients = await getAllowedClientIds(req.user.id, companyID);

        if (allowedClients.length === 0) {
            return res.status(200).json({ active: 0, closed: 0, archived: 0 });
        }

        const query = {
            companyID: companyID,
            clientID: { $in: allowedClients }
        };

        // Filter by specific active client if provided
        if (req.query.clientID) {
            // Validate it's in the allowed list
            const requestedClient = String(req.query.clientID);
            const isAllowed = allowedClients.some(c => c.toString() === requestedClient);
            if (isAllowed) {
                query.clientID = requestedClient; // Override $in with specific ID
            }
        }

        // Count Active
        const active = await Campaign.countDocuments({
            ...query,
            $or: [
                { "schemaConfig.mainSchema.status": "Active" },
                { status: "Active" },
                { status: true }
            ]
        });

        // Count Closed
        const closed = await Campaign.countDocuments({
            ...query,
            $or: [
                { "schemaConfig.mainSchema.status": "Closed" },
                { status: "Closed" },
                { status: false }
            ]
        });

        // Count Archived
        const archived = await Campaign.countDocuments({
            ...query,
            $or: [
                { "schemaConfig.mainSchema.status": "Archived" },
                { status: "Archived" }
            ]
        });

        res.status(200).json({ active, closed, archived });
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get recent campaigns for dashboard
// @route   GET /api/campaigns/recent
// @access  Private
const getRecentCampaigns = async (req, res) => {
    try {
        const companyID = req.user.currentCompanyID || req.user.companyID;
        const allowedClients = await getAllowedClientIds(req.user.id, companyID);

        if (allowedClients.length === 0) {
            return res.status(200).json([]);
        }

        // Fetch 5 most recent active campaigns
        const campaigns = await Campaign.find({
            companyID: companyID,
            clientID: { $in: allowedClients },
            $or: [
                { "schemaConfig.mainSchema.status": "Active" },
                { status: "Active" },
                { status: true }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json(campaigns);
    } catch (error) {
        console.error('Recent Campaigns Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Private
const getCampaign = async (req, res) => {
    try {
        const companyID = req.user.currentCompanyID || req.user.companyID;

        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Campaign ID' });
        }

        const campaign = await Campaign.findOne({
            _id: { $eq: req.params.id },
            companyID: companyID
        });

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        res.status(200).json(campaign);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const Activity = require('../models/Activity');

// @desc    Create new campaign
// @route   POST /api/campaigns
// @access  Private
const createCampaign = async (req, res) => {
    try {
        const companyID = req.user.currentCompanyID || req.user.companyID;
        // req.body contains flexible schema structure
        const sanitizedBody = sanitizeNoSQL(req.body);
        const campaign = await Campaign.create({
            ...sanitizedBody,
            companyID: companyID, // Force company context
            userID: req.user.id
            // Ensure schema default structure if needed
        });

        // Log Activity
        await Activity.create({
            companyID: companyID,
            userID: req.user.id,
            campaignID: campaign._id,
            type: 'CAMPAIGN_CREATED',
            title: 'Campaign Created',
            description: `Created campaign: ${campaign.title || 'Untitled'}`
        });

        res.status(201).json(campaign);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};



// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private
const updateCampaign = async (req, res) => {
    try {
        const companyID = req.user.currentCompanyID || req.user.companyID;

        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Campaign ID' });
        }

        const campaign = await Campaign.findOne({
            _id: { $eq: req.params.id },
            companyID: companyID
        });

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Prevent NoSQL operator injection by deeply sanitizing the update payload
        const updates = sanitizeNoSQL(req.body);

        // Additional safety check: ensure updates is a plain object
        if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
            return res.status(400).json({ message: 'Invalid update data' });
        }

        const updatedCampaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: false } // flexible schema often needs validators off or loose
        );

        res.status(200).json(updatedCampaign);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private
const deleteCampaign = async (req, res) => {
    try {
        const companyID = req.user.currentCompanyID || req.user.companyID;

        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Campaign ID' });
        }

        const campaign = await Campaign.findOne({
            _id: { $eq: req.params.id },
            companyID: companyID
        });

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        await campaign.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Bulk Update Campaign Status
// @route   POST /api/campaigns/bulk-status
// @access  Private
const bulkUpdateStatus = async (req, res) => {
    try {
        const { ids, status } = req.body;
        const companyID = req.user.currentCompanyID || req.user.companyID;

        if (!ids || !Array.isArray(ids) || !status) {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        // Update main status and schemaConfig status
        const updateResult = await Campaign.updateMany(
            {
                _id: { $in: ids },
                companyID: companyID
            },
            {
                $set: {
                    status: status,
                    "schemaConfig.mainSchema.status": status
                }
            }
        );

        // Log Bulk Activity
        await Activity.create({
            companyID: companyID,
            userID: req.user.id,
            type: 'BULK_UPDATE',
            title: 'Bulk Status Update',
            description: `Updated ${updateResult.modifiedCount} campaigns to ${status}`
        });

        res.status(200).json({
            message: 'Campaigns updated successfully',
            count: updateResult.modifiedCount
        });
    } catch (error) {
        console.error('bulkUpdateStatus Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getCampaigns,
    getCampaign,
    getCampaignStats,
    getRecentCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    bulkUpdateStatus
};
