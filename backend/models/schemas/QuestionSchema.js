const mongoose = require('mongoose');

const LocationConfigSchema = new mongoose.Schema({
    address: { type: String },
    addressType: { type: String },
    foundInResume: { type: Boolean },
    eligibilityCheck: { type: String },
    circle: {
        radius: { type: Number },
        metricUnit: { type: String }
    }
}, { strict: false, _id: false });

const QuestionSchema = new mongoose.Schema({
    questionID: { type: String }, // Links to the Standalone Questionnaire document if this is a copy
    questionName: { type: String },
    questionType: { type: String, enum: ['QUESTION', 'KNOCKOUT', 'ANNOUNCEMENT', 'FLOWCHART', 'GROUP'] },
    questionFormat: { type: String, enum: ['TEXT', 'AUDIO', 'IMAGE', 'VIDEO', 'GIF', 'DOCUMENT'] },
    responseType: { type: String, enum: ['TEXT', 'MCQ-SINGLE', 'MCQ-MULTI', 'VIDEO', 'AUDIO', 'DOCUMENT', 'SINGLE_LOCATION', 'MULTIPLE_LOCATIONS', 'RATING'] },

    questionTopic: { type: String },
    questionCategory: { type: String },
    labels: [{ type: String }],
    evaluationType: { type: String },
    durationInMinutes: { type: Number },
    reAnswer: { type: Boolean, default: false },
    impersonationQuestion: { type: Boolean, default: false },
    savedInExisting: { type: Boolean },
    completed: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    question: {
        text: { type: String },
        mediaURL: { type: String },
        formType: { type: String },
        formPlaceHolder: { type: String },
        audioReferenceText: { type: String },
        options: [{ type: String }],
        documentTypes: [{ type: String }],
        locationOption: [{ type: String }],
        locations: [LocationConfigSchema]
    },

    expectedResponse: {
        text: { type: String },
        mediaURL: { type: String },
        options: [{ type: String }],
        locations: [{ type: String }]
    },

    response: {
        text: { type: String },
        mediaURL: { type: String },
        options: [{ type: String }],
        duration: { type: Number },
        action: {
            type: { type: String }, // Used as MapToField type typically
            field: { type: String }, // Action DB Key
            fieldName: { type: String },
            fieldType: { type: String }
        }
    },

    feedBack: {
        rating: { type: Number },
        comment: { type: String },
        status: { type: String }
    },

    EQ: {
        MRRate: { type: Number },
        featuresList: [mongoose.Schema.Types.Mixed],
        scaledFeaturesList: [mongoose.Schema.Types.Mixed]
    },

    checkAttributes: [mongoose.Schema.Types.Mixed],

    flowChartNextQuestion: [{
        _id: { type: String }
    }],

    groupID: { type: String },
    groupName: { type: String },

    criteria: [{
        questionID: { type: String },
        roundNumber: { type: Number },
        response: [{ type: String }]
    }]
}, {
    strict: false, // Maintain strict false for any deeply nested unmapped fields
    timestamps: true
});

module.exports = QuestionSchema;
