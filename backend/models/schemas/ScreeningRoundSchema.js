const mongoose = require('mongoose');

// --- Dynamic Sub-Schemas (Placeholder for future tight typing) ---
// Note: As per the implementation plan, these are defined with strict: false
// for now to preserve legacy/dynamic fields while establishing the structure.

const QuestionSchema = require('./QuestionSchema');
const F2fScheduleSchema = new mongoose.Schema({}, { strict: false, _id: false });
const ReachOutSourcesSchema = new mongoose.Schema({}, { strict: false, _id: false });
const AutomateDetailsSchema = new mongoose.Schema({}, { strict: false, _id: false });
const RoundEligibilitySchema = new mongoose.Schema({}, { strict: false, _id: false });

// --- Unified Static ScreeningRound Schema ---
const screeningRoundSchema = new mongoose.Schema({
    id: { type: String }, // Internal/UI id
    roundName: { type: String, required: true },
    roundType: {
        type: String,
        required: true,
        enum: ['Assessment', 'Survey', 'Interview', 'Announcement'] // Known UI values
    },
    description: { type: String },
    communicationMethod: { type: String },
    availableMeetTypes: [{ type: String }],
    collapsed: { type: Boolean, default: false },
    order: { type: Number },
    deleted: { type: Boolean, default: false }, // Soft delete flag

    // Dynamic Nested Blocks
    questions: [QuestionSchema],
    flowChartQuestions: [QuestionSchema],
    groupQuestions: [QuestionSchema],
    f2fSchedule: F2fScheduleSchema,
    reachOutSources: ReachOutSourcesSchema,
    automateDetails: AutomateDetailsSchema,
    roundEligibility: RoundEligibilitySchema

    // Other legacy or dynamically added unpredictable keys will be allowed 
    // without throwing validation errors because strict is set to false.
}, {
    strict: false,
    _id: true, // We want Mongoose to generate an ObjectId for each array element
    timestamps: true // adds createdAt, updatedAt
});

module.exports = screeningRoundSchema;
