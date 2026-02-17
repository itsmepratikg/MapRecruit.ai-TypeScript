const mongoose = require('mongoose');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const Client = require('../models/Client');
const { sanitizeNoSQL, isValidObjectId } = require('../utils/securityUtils');
const ScrapeService = require('../services/scrapeService');
const Workflow = require('../models/Workflow');
const Interview = require('../models/Interview');
const notificationDispatcher = require('../services/notificationDispatcher');

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
        }).populate('clientID', '_id clientName name clientType clientLogo')
            .populate('ownerID', 'firstName lastName avatar color email')
            .lean(); // Use lean for performance and modification

        const interviewCounts = await Interview.aggregate([
            {
                $match: {
                    companyID: mongoose.Types.ObjectId.isValid(companyID) ? new mongoose.Types.ObjectId(companyID) : companyID,
                    linked: true
                }
            },
            { $group: { _id: "$campaignID", count: { $sum: 1 } } }
        ]);

        const interviewMap = new Map(interviewCounts.map(i => [i._id.toString(), i.count]));

        // Fetch Workflows for these campaigns to determine automation status
        const campaignIds = campaigns.map(c => c._id);
        let workflows = [];
        try {
            workflows = await Workflow.find({
                campaignID: { $in: campaignIds },
                status: 'Active'
            }).select('campaignID').lean();
        } catch (wfError) {
            console.error('Workflow fetch error (non-fatal):', wfError);
        }

        const workflowStatusMap = new Set(workflows.map(w => w.campaignID.toString()));

        // augment campaigns with computed fields
        const augmentedCampaigns = campaigns.map(campaign => {
            // 1. Owner logic (take first owner if array)
            const ownerObj = (campaign.ownerID && campaign.ownerID.length > 0) ? campaign.ownerID[0] : null;
            const owner = ownerObj ? {
                id: ownerObj._id,
                name: `${ownerObj.firstName} ${ownerObj.lastName}`,
                initials: `${ownerObj.firstName?.[0] || ''}${ownerObj.lastName?.[0] || ''}`.toUpperCase(),
                color: ownerObj.color || 'bg-slate-500',
                avatar: ownerObj.avatar
            } : { initials: "U", color: "bg-slate-500", name: "User" };

            // 2. Favorites logic (customData.favorites)
            const favorites = campaign.customData?.favorites || [];
            const isFavorite = favorites.some(uid => uid.toString() === req.user.id);

            // 3. Days Left logic (customData.closedAt)
            let daysLeft = 0;
            if (campaign.customData?.closedAt) {
                const closedAt = new Date(campaign.customData.closedAt);
                const now = new Date();
                const diffTime = closedAt - now;
                daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }

            // 4. Engage AI Status (Green/Yellow/Grey)
            let engageStatus = 'Grey';
            const hasRounds = (campaign.screeningRounds && campaign.screeningRounds.length > 0);

            if (hasRounds) {
                if (workflowStatusMap.has(campaign._id.toString())) {
                    engageStatus = 'Green';
                } else {
                    engageStatus = 'Yellow';
                }
            }

            // 5. Dynamic Profiles Count from interviews
            const profilesCount = interviewMap.get(campaign._id.toString()) || 0;

            return {
                ...campaign,
                owner,
                isFavorite,
                daysLeft,
                engageStatus,
                profilesCount // Add dynamic count
            };
        });

        res.status(200).json(augmentedCampaigns);
    } catch (error) {
        console.error('getCampaigns Error:', error);
        res.status(500).json({ message: 'Server Error ' + error.message });
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
            companyID: companyID,
            // REMEDIATION (SEC-01): Enforce client access
            clientID: { $in: await getAllowedClientIds(req.user.id, companyID) }
        });

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        const interviewCount = await Interview.countDocuments({
            campaignID: mongoose.Types.ObjectId.isValid(req.params.id) ? new mongoose.Types.ObjectId(req.params.id) : req.params.id,
            linked: true
        });

        res.status(200).json({
            ...campaign.toObject(),
            profilesCount: interviewCount
        });
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

        // Dispatch Notification (Async, don't await/block response)
        notificationDispatcher.dispatch(req.user.id, 'CAMPAIGN_CREATED', {
            message: `New Campaign Created: <b>${campaign.title}</b>`,
            link: `/campaigns/${campaign._id}`
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
            companyID: companyID,
            // REMEDIATION (SEC-01): Enforce client access
            clientID: { $in: await getAllowedClientIds(req.user.id, companyID) }
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
            companyID: companyID,
            // REMEDIATION (SEC-01): Enforce client access
            clientID: { $in: await getAllowedClientIds(req.user.id, companyID) }
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
                companyID: companyID,
                // REMEDIATION (SEC-02): Enforce client access for bulk ops
                clientID: { $in: await getAllowedClientIds(req.user.id, companyID) }
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

// @desc    Scrape job description from URL
// @route   POST /api/campaigns/scrape
// @access  Private
const scrapeJobUrl = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ message: 'URL is required' });
        }

        const result = await ScrapeService.scrapeJobDescription(url);
        res.status(200).json(result);
    } catch (error) {
        console.error('scrapeJobUrl Error:', error);
        res.status(500).json({ message: error.message || 'Failed to scrape URL' });
    }
};

// @desc    Toggle Campaign Favorite
// @route   POST /api/campaigns/:id/favorite
// @access  Private
const toggleFavorite = async (req, res) => {
    try {
        const companyID = req.user.currentCompanyID || req.user.companyID;
        const userId = req.user.id;
        const campaignId = req.params.id;

        if (!isValidObjectId(campaignId)) {
            return res.status(400).json({ message: 'Invalid Campaign ID' });
        }

        const campaign = await Campaign.findOne({ _id: campaignId, companyID });
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Initialize customData and favorites if not exist
        if (!campaign.customData) campaign.customData = {};
        if (!campaign.customData.favorites) campaign.customData.favorites = [];

        const favorites = campaign.customData.favorites.map(id => id.toString());
        const index = favorites.indexOf(userId);

        let isFavorite = false;
        if (index === -1) {
            // Add favorite
            campaign.customData.favorites.push(userId);
            isFavorite = true;
        } else {
            // Remove favorite
            campaign.customData.favorites.splice(index, 1);
            isFavorite = false;
        }

        // Mark modified because customData is Mixed type
        campaign.markModified('customData');
        await campaign.save();

        res.status(200).json({ isFavorite, id: campaignId });
    } catch (error) {
        console.error('toggleFavorite Error:', error);
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
    bulkUpdateStatus,
    bulkUpdateStatus,
    scrapeJobUrl,
    toggleFavorite
};
