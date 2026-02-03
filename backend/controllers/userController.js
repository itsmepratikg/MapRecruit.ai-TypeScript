const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role'); // Import Role model

// Helper to get role rank (lower is senior)
// Duplicate of logic in authController. ideally valid to move to a utils file.
const getRoleRank = async (roleId, companyID) => {
    if (!roleId) return Infinity;
    const RoleHierarchy = require('../models/RoleHierarchy');
    const hierarchyDoc = await RoleHierarchy.findOne({ companyID });

    if (!hierarchyDoc || !hierarchyDoc.hierarchy) return Infinity;

    // Find entry
    const entry = hierarchyDoc.hierarchy.find(h => h.roleID.toString() === roleId.toString());
    return entry ? entry.rank : Infinity;
};

// Helper to generate password from domain
const getDomainPassword = (email) => {
    if (!email) return 'Domain12!'; // Fallback if no email
    const domain = email.split('@')[1];
    if (!domain) return 'Domain12!';
    const name = domain.split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1) + '12!';
};

// @desc    Get all users for the tenant
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
    try {
        // Disable Caching
        res.set('Cache-Control', 'no-store');

        // Exact match as Schema and Data are now both ObjectId
        const users = await User.find({ companyID: req.user.companyID }).select('-password');

        console.log(`GET /users - Found ${users.length} users`);
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }

        const user = await User.findOne({
            _id: new mongoose.Types.ObjectId(req.params.id),
            companyID: req.user.companyID
        }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private
const createUser = async (req, res) => {
    try {
        console.log('POST /users - Payload:', JSON.stringify(req.body));
        const { email, password, clients } = req.body;
        const { companyID, id: actingUserId } = req.user;

        const userExists = await User.findOne({ email: { $eq: email } });
        if (userExists) {
            console.warn(`User creation failed: ${email} already exists`);
            return res.status(400).json({ message: 'User already exists' });
        }

        // --- STRICT CLIENT VALIDATION START ---
        // 1. Fetch Acting User
        const actingUser = await User.findById(actingUserId);
        if (!actingUser) return res.status(401).json({ message: 'Acting user not found' });

        // 2. Fetch Company Master List
        const company = await mongoose.connection.collection('companiesDB').findOne({
            _id: new mongoose.Types.ObjectId(companyID)
        });
        const companyClientIds = (company?.clients || []).map(id => id.toString());

        // 3. Determine Allowed Clients for Acting User
        let allowedForActor = [];
        const isAdmin = ['Product Admin', 'Admin', 'Super Admin'].includes(actingUser.role);

        if (isAdmin) {
            allowedForActor = companyClientIds;
        } else {
            const userClientIds = (actingUser.clients || []).map(id => id.toString());
            allowedForActor = companyClientIds.filter(id => userClientIds.includes(id));
        }

        // 4. Check Requested Clients against Allowed List
        const requestedClientIds = (clients || [])
            .filter(id => mongoose.Types.ObjectId.isValid(id)); // Filter valid IDs first specific to request

        const unauthorizedClients = requestedClientIds.filter(id => !allowedForActor.includes(id));

        if (unauthorizedClients.length > 0) {
            console.warn(`User ${actingUserId} attempted to assign unauthorized clients: ${unauthorizedClients}`);
            return res.status(403).json({
                message: 'You cannot assign clients you do not have access to.'
            });
        }
        // --- STRICT CLIENT VALIDATION END ---

        // Hierarchy Check: Cannot create a user with a role senior to or equal to your own (unless Product Admin)
        if (req.user.role !== 'Product Admin') {
            const operatorRoleID = req.user.roleID._id || req.user.roleID;
            const targetRoleID = req.body.role; // The role being assigned

            if (targetRoleID) {
                const operatorRank = await getRoleRank(operatorRoleID, req.user.currentCompanyID || req.user.companyID);
                const targetRank = await getRoleRank(targetRoleID, req.user.currentCompanyID || req.user.companyID);

                // If creating someone higher ranked (lower number) -> Deny
                // If operatorRank is 2 and target is 1 -> 2 >= 1 (True, deny)
                if (operatorRank >= targetRank) {
                    return res.status(403).json({ message: 'Insufficient seniority to assign this role.' });
                }
            }
        }

        // Process Client ObjectIds (Valid ones only, which we now know are authorized)
        const clientObjectIds = requestedClientIds.map(id => new mongoose.Types.ObjectId(id));

        const userData = {
            ...req.body,
            password: password || getDomainPassword(email), // Dynamic domain-based password
            role: req.body.role || 'Recruiter', // Default role if not provided
            clients: clientObjectIds, // Ensure ObjectIds
            companyID: req.user.companyID // Ensure tenant context
        };

        console.log('Creating User with Data:', JSON.stringify({ ...userData, password: '***' }, null, 2));

        const user = await User.create(userData);

        const createdUser = await User.findById(user._id).select('-password');
        res.status(201).json(createdUser);
    } catch (error) {
        console.error('CREATE USER FATAL ERROR:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }

        const user = await User.findOne({
            _id: new mongoose.Types.ObjectId(req.params.id),
            companyID: req.user.companyID
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isSelf = req.user.id.toString() === user._id.toString();

        // Hierarchy Check
        // Allow if Product Admin OR Self (with restrictions below) OR Senior
        if (req.user.role !== 'Product Admin' && !isSelf) {
            const operatorRoleID = req.user.roleID._id || req.user.roleID;
            const targetRoleID = user.role;

            if (targetRoleID) {
                const operatorRank = await getRoleRank(operatorRoleID, req.user.currentCompanyID || req.user.companyID);
                const targetRank = await getRoleRank(targetRoleID, req.user.currentCompanyID || req.user.companyID);

                // If operatorRank >= targetRank -> Deny (unless it's self, handled above)
                if (operatorRank >= targetRank) {
                    return res.status(403).json({ message: 'Insufficient seniority to modify this user.' });
                }
            }
        }

        // Update fields
        // Update fields
        const restrictedFields = ['password', '_id', 'clients']; // Handle clients separately

        // Prevent NoSQL operator injection in top-level fields
        const updates = { ...req.body };
        for (const key of Object.keys(updates)) {
            if (key.startsWith('$')) {
                delete updates[key];
            }
        }

        // Privilege Escalation Check: Role Change
        // If changing role, MUST be Product Admin OR Senior. Self cannot change role.
        if (updates.role && updates.role !== user.role) {
            if (isSelf && req.user.role !== 'Product Admin') {
                // Self cannot change own role unless Product Admin (maybe?)
                // Safer: Self NEVER changes role via this endpoint.
                delete updates.role;
                console.warn(`User ${req.user.id} attempted to change own role. Ignored.`);
            } else if (req.user.role !== 'Product Admin') {
                // Operator changing someone else's role. Checked by hierarchy above, BUT
                // we must also check if the NEW role is assignable by operator (cannot promote junior to be your boss).
                // Actually hierarchy check above allows edit. But can I make them a Super Admin?
                // Ideally check rank of New Role too.
                const operatorRoleID = req.user.roleID._id || req.user.roleID;
                const newRoleID = updates.role;

                const operatorRank = await getRoleRank(operatorRoleID, req.user.currentCompanyID || req.user.companyID);
                const newRoleRank = await getRoleRank(newRoleID, req.user.currentCompanyID || req.user.companyID);

                if (operatorRank >= newRoleRank) {
                    return res.status(403).json({ message: 'Insufficient seniority to assign this role level.' });
                }
            }
        }

        Object.keys(updates).forEach(key => {
            if (key === 'accessibilitySettings') {
                // Deep merge for accessibilitySettings to allow partial updates
                user.accessibilitySettings = {
                    ...user.accessibilitySettings,
                    ...req.body.accessibilitySettings,
                    dashboardConfig: {
                        ...(user.accessibilitySettings?.dashboardConfig || {}),
                        ...(req.body.accessibilitySettings?.dashboardConfig || {}),
                        layouts: {
                            ...(user.accessibilitySettings?.dashboardConfig?.layouts || {}),
                            ...(req.body.accessibilitySettings?.dashboardConfig?.layouts || {})
                        }
                    }
                };
                user.markModified('accessibilitySettings');
            } else if (!restrictedFields.includes(key)) {
                user[key] = updates[key];
            }
        });

        // Handle clients update with STRICT VALIDATION
        if (req.body.clients) {
            const { companyID, id: actingUserId } = req.user;
            const actingUser = await User.findById(actingUserId);

            if (actingUser) {
                // Fetch Company Master List
                const company = await mongoose.connection.collection('companiesDB').findOne({
                    _id: new mongoose.Types.ObjectId(companyID)
                });
                const companyClientIds = (company?.clients || []).map(id => id.toString());

                // Determine Allowed Clients for Acting User
                let allowedForActor = [];
                const isAdmin = ['Product Admin', 'Admin', 'Super Admin'].includes(actingUser.role);

                if (isAdmin) {
                    allowedForActor = companyClientIds;
                } else {
                    const userClientIds = (actingUser.clients || []).map(id => id.toString());
                    allowedForActor = companyClientIds.filter(id => userClientIds.includes(id));
                }

                // Check Requested Clients against Allowed List
                const requestedClientIds = (req.body.clients || [])
                    .filter(id => mongoose.Types.ObjectId.isValid(id));

                const unauthorizedClients = requestedClientIds.filter(id => !allowedForActor.includes(id));

                if (unauthorizedClients.length > 0) {
                    console.warn(`User ${actingUserId} attempted to assign unauthorized clients in UPDATE: ${unauthorizedClients}`);
                    // We can either block the whole request or just filter them out. 
                    // Blocking is safer and clearer to the user (via frontend error).
                    return res.status(403).json({
                        message: 'You cannot assign clients you do not have access to.'
                    });
                }

                // Assign validated clients
                user.clients = requestedClientIds.map(id => new mongoose.Types.ObjectId(id));
            }
        }

        // Handle password update separately if needed
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        // Fetch return user dealing with ID type potential mismatch
        const responseUser = await User.findOne({ _id: updatedUser._id }).select('-password');

        res.status(200).json(responseUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateActiveAt = async (req, res) => {
    try {
        const now = new Date();
        await User.findByIdAndUpdate(req.user.id, {
            lastActiveAt: now,
            lastLoginAt: now // User requested to update lastLoginAt on activity/page change
        });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = getDomainPassword(user.email);
        await user.save();
        res.status(200).json({ success: true, message: `Password reset to ${user.password}` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    updateActiveAt,
    resetPassword
};
