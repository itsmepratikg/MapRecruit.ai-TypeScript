const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.Mixed
    },
    companyID: {
        type: String,
        required: true,
        index: true
    },
    activeClientID: {
        type: String,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true // Will be hashed
    },
    role: {
        type: String, // e.g., "Product Admin", "Recruiter"
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    // Flexible Schema for Settings as per "Pratik User Schema Prod Admin.json"
    accessibilitySettings: {
        theme: { type: String, default: 'system' },
        language: { type: String, default: 'English (US)' },
        dashboardConfig: {
            type: mongoose.Schema.Types.Mixed,
            default: {
                rowHeight: 30,
                margin: 15,
                layouts: {
                    desktop: [],
                    tablet: [],
                    mobile: []
                }
            }
        }
    },
    // Other top-level keys from the example schema if necessary
    clients: {
        type: mongoose.Schema.Types.Mixed
    },
    dashboard: {
        type: mongoose.Schema.Types.Mixed
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },
    loginCount: {
        type: Number,
        default: 0
    },
    lastLoginAt: {
        type: Date
    },
    lastActiveAt: {
        type: Date
    },
    timeZone: {
        type: String,
        default: 'Asia/Kolkata'
    },
    calendarSettings: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true,
    strict: false // Allow other fields to be saved without definition
});

// Middleware to hash password
// Middleware to hash password
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema, 'usersDB');

module.exports = User;
