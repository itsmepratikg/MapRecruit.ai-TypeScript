const mongoose = require('mongoose');

const candidateSchema = mongoose.Schema({
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    clientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        index: true
    },
    // Core Profile Data
    profile: {
        fullName: { type: String, index: true },
        firstName: String,
        lastName: String,
        emails: [{
            text: String,
            email: { type: String, index: true }, // Index email for duplicate checking
            type: String,
            preferred: String
        }],
        phones: [{
            text: String,
            phoneNumberOnly: String,
            type: String
        }],
        // Flexible for other profile keys like dob, gender, etc.
        type: mongoose.Schema.Types.Mixed
    },
    professionalSummary: {
        type: mongoose.Schema.Types.Mixed
    },
    professionalQualification: {
        education: [mongoose.Schema.Types.Mixed],
        certifications: [mongoose.Schema.Types.Mixed],
        skills: [mongoose.Schema.Types.Mixed],
        type: mongoose.Schema.Types.Mixed
    },
    professionalExperience: [mongoose.Schema.Types.Mixed],
    otherInformation: {
        type: mongoose.Schema.Types.Mixed
    },
    metaData: {
        originalFileName: String,
        mrProfileID: { type: String, index: true },
        type: mongoose.Schema.Types.Mixed
    },
    tagID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }]
}, {
    timestamps: true,
    strict: false
});

const Candidate = mongoose.model('Candidate', candidateSchema, 'resumesDB');

module.exports = Candidate;
