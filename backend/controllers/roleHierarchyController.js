const RoleHierarchy = require('../models/RoleHierarchy');
const Role = require('../models/Role');
const { sanitizeNoSQL } = require('../utils/securityUtils');

// @desc    Get Role Hierarchy for current Company
// @route   GET /api/roles/hierarchy
// @access  Private
const getHierarchy = async (req, res) => {
    try {
        const companyID = req.user.currentCompanyID || req.user.companyID;

        let hierarchyDoc = await RoleHierarchy.findOne({ companyID: { $eq: companyID } })
            .populate('hierarchy.roleID', 'roleName description');

        if (!hierarchyDoc) {
            // If no hierarchy exists, fetch all roles and return them unranked (or init default?)
            // For now, we return an empty structure or letting frontend decide to "Init"
            // Alternatively, we can return all roles not yet in hierarchy.
            const allRoles = await Role.find({
                $or: [
                    { companyID: companyID },
                    { companyID: { $exists: false } } // system roles? need better filtering typically
                ]
            }).select('roleName description');

            // Return a simulated structure or just the roles
            return res.status(200).json({
                exists: false,
                roles: allRoles,
                hierarchy: []
            });
        }

        res.status(200).json({
            exists: true,
            hierarchy: hierarchyDoc.hierarchy
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching hierarchy' });
    }
};

// @desc    Update/Create Role Hierarchy
// @route   POST /api/roles/hierarchy
// @access  Private (Admin)
const updateHierarchy = async (req, res) => {
    try {
        const companyID = req.user.currentCompanyID || req.user.companyID;
        const { hierarchy } = req.body; // Expecting [{ roleID, rank }, ...]

        if (!Array.isArray(hierarchy)) {
            return res.status(400).json({ message: 'Invalid hierarchy format' });
        }

        // Upsert
        const updatedDoc = await RoleHierarchy.findOneAndUpdate(
            { companyID },
            {
                companyID,
                hierarchy,
                updatedBy: req.user.id
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        ).populate('hierarchy.roleID', 'roleName description');

        res.status(200).json(updatedDoc);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error updating hierarchy' });
    }
};

module.exports = {
    getHierarchy,
    updateHierarchy
};
