const Candidate = require('../models/Candidate');
const Client = require('../models/Client');
const Article = require('../models/Article');
const Tag = require('../models/Tag');
const Campaign = require('../models/Campaign');
const { sanitizeNoSQL, isValidObjectId } = require('../utils/securityUtils');

// Helper to get access filter based on user's active client settings
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
        } else if (searchLevel === 'OwningEntity') {
            // If it's owningEntity level, we need to know what entities the user is tied to.
            // For now, if activeClientID is set, we might stick to that or expand.
            // Assuming OwningEntity level means all clients under similar ownership?
            // Simplified: return company level for now or specific entity list if available.
            return { companyID };
        } else {
            // Default to Client level access
            return { clientID: activeClientID.toString() };
        }
    } catch (error) {
        console.error('Error fetching client access level:', error);
        return { companyID };
    }
};

// @desc    Get all candidate profiles for the tenant
// @route   GET /api/profiles
// @access  Private
const getProfiles = async (req, res) => {
    try {
        const accessFilter = await getAccessFilter(req.user);
        const { folderId, tagId, search, status, page = 1, limit = 20 } = req.query;

        let query = { ...accessFilter };

        // Support for Folder (Article) filtering
        if (folderId && typeof folderId === 'string') {
            query.articleID = folderId;
        }

        // Support for Tag filtering
        if (tagId && typeof tagId === 'string') {
            query.tagID = tagId;
        }

        // Support for Search
        if (search) {
            query['profile.fullName'] = { $regex: String(search), $options: 'i' };
        }

        // Support for Status filtering
        if (status && typeof status === 'string') {
            query.personnelStatus = status;
        }

        const skip = (page - 1) * limit;

        const profiles = await Candidate.find(query)
            .select('resume profile.fullName profile.emails profile.phones profile.locations professionalSummary.currentRole.jobTitle professionalSummary.yearsOfExperience professionalExperience metaData.mrProfileID metaData.originalFileName personnelStatus employmentStatus availability professionalQualification.skills clientID companyID articleID tagID metaData.newFileName metaData.newFilePath')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Candidate.countDocuments(query);

        res.status(200).json({
            profiles,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single profile details
// @route   GET /api/profiles/:id
// @access  Private
const getProfile = async (req, res) => {
    try {
        const accessFilter = await getAccessFilter(req.user);

        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Profile ID' });
        }

        const profile = await Candidate.findOne({
            _id: { $eq: req.params.id },
            ...accessFilter
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found or access denied' });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new profile
// @route   POST /api/profiles
// @access  Private
const createProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, title, company, location, skills, source } = sanitizeNoSQL(req.body);

        // Map flat form data to nested Candidate schema
        const candidateData = {
            companyID: req.user.currentCompanyID || req.user.companyID,
            clientID: req.user.activeClientID,
            profile: {
                firstName,
                lastName,
                fullName: `${firstName} ${lastName}`.trim(),
                emails: email ? [{
                    value: email, // Standardized key if possible, but schema shows mixed. Using 'text' based on schema observation or standard
                    text: email,
                    email: email,
                    type: 'Personal',
                    preferred: 'Yes'
                }] : [],
                phones: phone ? [{
                    value: phone,
                    text: phone,
                    type: 'Mobile'
                }] : [],
                locations: location ? [{
                    city: location.split(',')[0]?.trim(),
                    state: location.split(',')[1]?.trim(),
                    country: 'USA', // Defaulting for now
                    text: location
                }] : []
            },
            professionalSummary: {
                currentRole: {
                    jobTitle: title,
                    companyName: company
                }
            },
            professionalQualification: {
                skills: skills ? skills.split(',').map(s => ({
                    name: s.trim(),
                    lastUsed: new Date()
                })) : []
            },
            metaData: {
                source: source || 'Manual',
                originalFileName: 'Manual Entry',
                importDate: new Date()
            },
            personnelStatus: 'Lead', // Default status for new manual entries
            employmentStatus: 'Active'
        };

        const profile = await Candidate.create(candidateData);

        res.status(201).json(profile);
    } catch (error) {
        console.error('createProfile Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update profile
// @route   PUT /api/profiles/:id
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const accessFilter = await getAccessFilter(req.user);

        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Profile ID' });
        }

        const profile = await Candidate.findOne({
            _id: { $eq: req.params.id },
            ...accessFilter
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found or access denied' });
        }

        const updates = sanitizeNoSQL(req.body);

        // Additional safety check: ensure updates is a plain object
        if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
            return res.status(400).json({ message: 'Invalid update data' });
        }

        const updatedProfile = await Candidate.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: false }
        );

        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete profile
// @route   DELETE /api/profiles/:id
// @access  Private
const deleteProfile = async (req, res) => {
    try {
        const accessFilter = await getAccessFilter(req.user);

        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Profile ID' });
        }

        const profile = await Candidate.findOne({
            _id: { $eq: req.params.id },
            ...accessFilter
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found or access denied' });
        }

        await profile.remove();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get profile statistics (total count)
// @route   GET /api/profiles/stats
// @access  Private
const getProfileStats = async (req, res) => {
    try {
        const accessFilter = await getAccessFilter(req.user);
        const count = await Candidate.countDocuments(accessFilter);
        res.status(200).json({ totalProfiles: count });
    } catch (error) {
        console.error('getProfileStats Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get folder metrics (distribution by status)
// @route   GET /api/profiles/folder-metrics
// @access  Private
const getFolderMetrics = async (req, res) => {
    try {
        const accessFilter = await getAccessFilter(req.user);

        // Aggregate by personnelStatus
        const stats = await Candidate.aggregate([
            { $match: accessFilter },
            {
                $group: {
                    _id: "$personnelStatus",
                    count: { $sum: 1 }
                }
            }
        ]);

        const formatted = stats.map(s => ({
            name: s._id || 'Unknown',
            value: s.count,
            color: s._id === 'Applicant' ? '#3b82f6' : (s._id === 'Contractor' ? '#8b5cf6' : '#10b981')
        }));

        res.status(200).json(formatted);
    } catch (error) {
        console.error('getFolderMetrics Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Articles (mapped to Folders in UI)
// @route   GET /api/profiles/articles
// @access  Private
const getArticles = async (req, res) => {
    try {
        const companyID = req.user.currentCompanyID || req.user.companyID;

        // 1. Find all campaigns for this company to get linked articleIDs
        const campaigns = await Campaign.find({ companyID }).select('articleID');
        const articleIDs = [...new Set(campaigns.flatMap(c => c.articleID || []))];

        // 2. Fetch the Articles
        const articles = await Article.find({
            _id: { $in: articleIDs },
            active: true
        });

        // 3. Get profile counts for each article
        const articleStats = await Candidate.aggregate([
            { $match: { companyID, articleID: { $in: articleIDs } } },
            { $unwind: "$articleID" },
            { $group: { _id: "$articleID", count: { $sum: 1 } } }
        ]);

        const statsMap = articleStats.reduce((acc, curr) => {
            acc[curr._id.toString()] = curr.count;
            return acc;
        }, {});

        const formatted = articles.map(art => ({
            _id: art._id,
            name: art.title,
            count: statsMap[art._id.toString()] || 0,
            icon: 'folder'
        }));

        res.status(200).json(formatted);
    } catch (error) {
        console.error('getArticles Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Tags
// @route   GET /api/profiles/tags
// @access  Private
const getTags = async (req, res) => {
    try {
        const companyID = req.user.currentCompanyID || req.user.companyID;

        const tags = await Tag.find({ companyID, active: true });

        // Get counts for each tag
        const tagStats = await Candidate.aggregate([
            { $match: { companyID, tagID: { $exists: true, $ne: [] } } },
            { $unwind: "$tagID" },
            { $group: { _id: "$tagID", count: { $sum: 1 } } }
        ]);

        const statsMap = tagStats.reduce((acc, curr) => {
            acc[curr._id.toString()] = curr.count;
            return acc;
        }, {});

        const formatted = tags.map(t => ({
            _id: t._id,
            name: t.name,
            color: t.color,
            count: statsMap[t._id.toString()] || 0
        }));

        res.status(200).json(formatted);
    } catch (error) {
        console.error('getTags Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProfiles,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    getProfileStats,
    getFolderMetrics,
    getArticles,
    getTags
};
