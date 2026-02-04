const mongoose = require('mongoose');

const roleHierarchySchema = mongoose.Schema({
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        unique: true
    },
    // Ordered list of roles. Index 0 = Highest Rank (Senior), Index N = Lowest Rank (Junior)
    hierarchy: [{
        roleID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
            required: true
        },
        rank: {
            type: Number,
            required: true
        }
    }],
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('RoleHierarchy', roleHierarchySchema);
