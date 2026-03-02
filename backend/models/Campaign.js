
const mongoose = require('mongoose');

const campaignSchema = mongoose.Schema({
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    clientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
        index: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },

    // Core Metadata
    title: { type: String, required: true },
    displayName: { type: String },
    status: { type: String, default: 'Active', index: true }, // "Active", "Closed"
    jobStatus: { type: String, default: 'Active' },
    visibility: { type: String, default: 'All' }, // "All", "Few", "Only Me"
    openJob: { type: Boolean, default: true },
    packageOpted: { type: String },

    // Relations / Teams - Flattened
    ownerID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    managerID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    recruiterID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    sharedUserID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Job Data
    job: {
        details: {
            jobTitle: {
                text: String,
                jobTitles: [mongoose.Schema.Types.Mixed] // Legacy taxonomy
            },
            locations: [{
                city: String,
                state: String,
                country: String,
                location: String
            }],
            offeredSalary: {
                min: Number,
                max: Number,
                currency: String,
                period: String
            },
            workingHours: mongoose.Schema.Types.Mixed,
            jobType: String,
            jobDescription: {
                text: String
            }
        },
        requirements: {
            skills: [{
                text: String,
                eligibilityCheck: String, // "Required", "Preferred"
                importance: String, // "Very Important", etc.
                yearsOfExperienceMin: Number,
                yearsOfExperienceMax: Number,
                canonical_name: String
            }],
            contextualSkills: [mongoose.Schema.Types.Mixed],
            removedSkills: [mongoose.Schema.Types.Mixed],
            importantLines: [mongoose.Schema.Types.Mixed],
            suggestedSkills: [mongoose.Schema.Types.Mixed]
        },
        otherInformation: mongoose.Schema.Types.Mixed,
        metaData: mongoose.Schema.Types.Mixed
    },

    // AI Configuration
    MRIPreferences: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    // Modules
    campaignModules: {
        enabled: { type: Boolean, default: true },
        sourceAI: mongoose.Schema.Types.Mixed,
        matchAI: mongoose.Schema.Types.Mixed,
        engageAI: mongoose.Schema.Types.Mixed,
        qualifyAI: mongoose.Schema.Types.Mixed
    },

    // Rounds
    screeningRounds: [require('./schemas/ScreeningRoundSchema')], // Array of strongly-typed round configs
    qualifyingRounds: [mongoose.Schema.Types.Mixed],

    // Job Posting
    jobPosting: {
        enabled: Boolean,
        startDate: Date,
        endDate: Date,
        jobBoards: [String]
    },

    // Stats
    stats: {
        netPromoterScore: mongoose.Schema.Types.Mixed,
        profilesCount: mongoose.Schema.Types.Mixed,
        openings: mongoose.Schema.Types.Mixed
    },

    passcode: { type: String, index: true },
    customData: mongoose.Schema.Types.Mixed,
    tags: [String]

}, {
    timestamps: true,
    strict: false, // Allow for evolving schema/unmapped fields from JSON
    collection: 'campaigns' // Explicitly set collection name to match request if needed, or 'campaignsDB' as before
});

const Campaign = mongoose.model('Campaign', campaignSchema, 'campaignsDB');

module.exports = Campaign;
