const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const Client = require('../models/Client');

/**
 * Filter user.clients to only include those belonging to the current context
 */
const filterClientsByContext = async (userObject) => {
    // console.log(`[DEBUG] filterClientsByContext - User: ${userObject.email}, Context Company: ${userObject.currentCompanyID || userObject.companyID}`);
    const rawClients = userObject.clients || [];
    const contextCompanyID = userObject.currentCompanyID || userObject.companyID;

    if (!contextCompanyID || rawClients.length === 0) {
        // console.log('[DEBUG] filterClientsByContext - No context company or no raw clients.');
        return [];
    }

    // Normalize IDs (handle potential {$oid: ...} structure or raw ObjectIds)
    const normalizedIds = rawClients.map(c => {
        if (c && typeof c === 'object') {
            return c.$oid || (c._id ? (c._id.$oid || c._id) : c);
        }
        return c;
    });

    // console.log(`[DEBUG] filterClientsByContext - Requesting ${normalizedIds.length} IDs from ClientDB:`, normalizedIds);

    // Fetch clients that are assigned to this user AND belongs to the current company
    const validClients = await Client.find({
        _id: { $in: normalizedIds },
        companyID: contextCompanyID
    }).select('_id clientName name clientLogo');

    // console.log(`[DEBUG] filterClientsByContext - Found ${validClients.length} valid client docs.`);

    // Fetch company info for logo fallback
    const Company = require('../models/Company');
    const company = await Company.findById(contextCompanyID).select('companyProfile.companyLogo');
    const companyLogo = company?.companyProfile?.companyLogo || null;

    return validClients.map(c => {
        const name = c.clientName || c.name || 'Unnamed Client';
        return {
            _id: c._id,
            name,
            clientName: name,
            clientLogo: c.clientLogo || companyLogo
        };
    });
};

// Generate JWT
const generateToken = (id, email, companyID, activeClientID, role, roleID, currentCompanyID, productAdmin) => {
    const payload = { id, email, companyID, activeClientID, role, roleID };
    if (currentCompanyID) payload.currentCompanyID = currentCompanyID;
    if (productAdmin !== undefined) payload.productAdmin = productAdmin;
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
// Helper to generate password from domain
const getDomainPassword = (email) => {
    if (!email) return null;
    const domain = email.split('@')[1];
    if (!domain) return null;
    const name = domain.split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1) + '12!';
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        let { email, password, role, companyID, activeClientID } = req.body;

        // Auto-generate password if not provided, based on domain rule: Domain12!
        if (!password && email) {
            password = getDomainPassword(email);
        }

        if (!email || !password || !companyID) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        if (typeof email !== 'string') return res.status(400).json({ message: 'Invalid email format' });

        // Check for user exists - Secure against NoSQL Injection
        const userExists = await User.findOne({ email: { $eq: email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            email,
            password,
            role: role || 'User',
            companyID,
            activeClientID
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                email: user.email,
                role: user.role,
                companyID: user.companyID,
                activeClientID: user.activeClientID,
                token: generateToken(user._id, user.email, user.companyID, user.activeClientID, user.role, user.roleID, null, user.accessibilitySettings?.productAdmin),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== 'string') return res.status(400).json({ message: 'Invalid email format' });

        // Check for user email - Secure against NoSQL Injection
        const user = await User.findOne({ email: { $eq: email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.status === false) {
            return res.status(403).json({ message: 'User account is inactive' });
        }

        if (await user.matchPassword(password)) {
            // Populate Role to check tenant access
            const populatedUser = await User.findById(user._id).populate('roleID');

            if (populatedUser && populatedUser.roleID && populatedUser.roleID.companyID) {
                const companyIDs = Array.isArray(populatedUser.roleID.companyID)
                    ? populatedUser.roleID.companyID
                    : [populatedUser.roleID.companyID];

                const hasAccess = companyIDs.some(id => id.toString() === user.companyID.toString());

                if (!hasAccess) {
                    console.warn(`[Auth] Blocked login: Role ${populatedUser.roleID.roleName} is not valid for Company ${user.companyID}`);
                    return res.status(403).json({ message: 'Current role is not authorized for this company tenant.' });
                }
            }

            // Update login tracking
            user.loginCount = (user.loginCount || 0) + 1;
            user.lastLoginAt = new Date();
            user.lastActiveAt = new Date();
            await user.save();

            // Exclude password from response
            const userObj = populatedUser.toObject();
            delete userObj.password;

            // Normalize field names for frontend compatibility
            userObj.id = userObj._id;
            userObj.clientID = await filterClientsByContext(userObj);
            userObj.clients = userObj.clientID;

            res.json({
                ...userObj,
                token: generateToken(user._id, user.email, user.companyID, user.activeClientID, user.role, user.roleID, user.currentCompanyID, user.accessibilitySettings?.productAdmin),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }

        const user = await User.findOne({ _id: new mongoose.Types.ObjectId(req.user.id) })
            .select('-password')
            .populate({
                path: 'roleID',
                select: 'roleName accessibilitySettings companyID'
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate ETag based on updatedAt timestamp
        const lastUpdated = user.updatedAt ? new Date(user.updatedAt).getTime() : 0;
        const etag = `"${lastUpdated.toString(16)}"`;

        res.setHeader('ETag', etag);

        // Check for conditional GET
        if (req.headers['if-none-match'] === etag) {
            return res.status(304).end();
        }

        // console.log('[API] /auth/me Responding for user:', user.email);
        // console.log('[API] /auth/me RoleID:', user.roleID); // Should be object

        const userObj = user.toObject();
        userObj.id = userObj._id;
        userObj.clientID = await filterClientsByContext(userObj);
        userObj.clients = userObj.clientID;

        res.status(200).json(userObj);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Impersonate another user (Admin only)
// @route   POST /api/auth/impersonate
// @access  Private (Product Admin)
const impersonateUser = async (req, res) => {
    try {
        const { targetUserId, mode = 'read-only' } = req.body;

        if (typeof targetUserId !== 'string') return res.status(400).json({ message: 'Invalid Target User ID' });

        // 1. Verify Requestor is Admin
        if (req.user.role !== 'Product Admin') {
            return res.status(403).json({ message: 'Not authorized for impersonation' });
        }

        // 2. Find Target User
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ message: 'Target user not found' });
        }

        // 4. Generate Impersonation Token
        const token = jwt.sign({
            id: targetUser._id,
            email: targetUser.email,
            companyID: targetUser.companyID,
            currentCompanyID: targetUser.currentCompanyID,
            activeClientID: targetUser.activeClientID,
            role: targetUser.role,
            // Impersonation Claims
            impersonatorId: req.user.id,
            mode: mode // 'read-only' | 'full'
        }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({
            ...targetUser.toObject(),
            token,
            isImpersonated: true,
            mode
        });

    } catch (error) {
        console.error('Impersonation Error:', error);
        res.status(500).json({ message: 'Server Error during impersonation' });
    }
};

// @desc    List all system roles
// @route   GET /api/auth/roles
// @access  Private
const listRoles = async (req, res) => {
    try {
        const roles = await Role.find({});
        res.json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new role
// @route   POST /api/auth/roles
const createRole = async (req, res) => {
    try {
        const { roleName, description, accessibilitySettings, companyID } = req.body;
        const role = await Role.create({
            roleName,
            description,
            accessibilitySettings,
            companyID
        });
        res.status(201).json(role);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Helper to get role rank (lower is senior)
const getRoleRank = async (roleId, companyID) => {
    const RoleHierarchy = require('../models/RoleHierarchy');
    const hierarchyDoc = await RoleHierarchy.findOne({ companyID });

    if (!hierarchyDoc || !hierarchyDoc.hierarchy) return Infinity; // No hierarchy = lowest rank

    const entry = hierarchyDoc.hierarchy.find(h => h.roleID.toString() === roleId.toString());
    return entry ? entry.rank : Infinity;
};

// @desc    Update a role
// @route   PUT /api/auth/roles/:id
const updateRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        // Hierarchy Check
        if (req.user.role !== 'Product Admin') {
            const userRoleID = req.user.roleID._id || req.user.roleID; // depending on population
            const userRank = await getRoleRank(userRoleID, req.user.currentCompanyID || req.user.companyID);
            const targetRank = await getRoleRank(role._id, req.user.currentCompanyID || req.user.companyID);

            // If user is lower rank (higher number) or equal (?), prevent edit
            // Policy: Seniors can edit Juniors. Peers cannot edit Peers (optional, assume strict seniority).
            // userRank 1 < targetRank 2 => Allowed
            // userRank 2 > targetRank 1 => Denied
            // userRank 2 === targetRank 2 => Denied (assuming one cannot edit value of same rank)

            if (userRank >= targetRank) {
                return res.status(403).json({ message: 'Insufficient seniority to modify this role.' });
            }
        }

        Object.assign(role, req.body);
        await role.save();
        res.json(role);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a role
// @route   DELETE /api/auth/roles/:id
const deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        // Hierarchy Check
        if (req.user.role !== 'Product Admin') {
            const userRoleID = req.user.roleID._id || req.user.roleID;
            const userRank = await getRoleRank(userRoleID, req.user.currentCompanyID || req.user.companyID);
            const targetRank = await getRoleRank(role._id, req.user.currentCompanyID || req.user.companyID);

            if (userRank >= targetRank) {
                return res.status(403).json({ message: 'Insufficient seniority to delete this role.' });
            }
        }

        await role.deleteOne();
        res.json({ message: 'Role removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Switch Company Environment
// @route   POST /api/auth/switch-company
// @access  Private
const switchCompany = async (req, res) => {
    try {
        const { companyId, clientId } = req.body;
        if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: 'Invalid Company ID' });
        }

        // console.log(`[DEBUG] Switch-Context request for UserID: ${req.user.id} to Company: ${companyId}, Client: ${clientId || 'AUTO'}`);

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // 1. Update currentCompanyID
        user.currentCompanyID = new mongoose.Types.ObjectId(companyId);

        // 2. Determine activeClientID
        const lastActiveMap = user.accessibilitySettings?.lastActiveClients || {};
        const savedClientId = lastActiveMap[companyId.toString()];

        if (clientId && mongoose.Types.ObjectId.isValid(clientId)) {
            user.activeClientID = new mongoose.Types.ObjectId(clientId);
        } else if (savedClientId && mongoose.Types.ObjectId.isValid(savedClientId)) {
            user.activeClientID = new mongoose.Types.ObjectId(savedClientId);
            console.log(`[DEBUG] Restored last active client ${savedClientId} for company ${companyId}`);
        } else {
            // Auto-pick logic if switching company or clientId not provided
            const company = await mongoose.connection.collection('companiesDB').findOne({
                _id: new mongoose.Types.ObjectId(companyId)
            });

            if (company && company.clients && company.clients.length > 0) {
                // Find all active clients in the company
                const Client = require('../models/Client');
                const queryIds = company.clients.map(id => {
                    return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id;
                });

                const activeClient = await Client.findOne({
                    _id: { $in: queryIds },
                    enable: true
                });

                if (activeClient) {
                    user.activeClientID = activeClient._id;
                    console.log(`[DEBUG] Auto-selected Client: ${activeClient._id} for Company: ${companyId}`);
                } else {
                    // Fallback to first available client if none are 'enabled'
                    user.activeClientID = queryIds[0];
                    console.log(`[DEBUG] Fallback-selected first Client: ${queryIds[0]} for Company: ${companyId}`);
                }
            } else {
                console.warn(`[DEBUG] No clients found for Company: ${companyId}. User.activeClientID remains unchanged or null.`);
            }
        }

        // 3. Save Client preference per Company for persistence
        if (!user.accessibilitySettings) user.accessibilitySettings = {};
        if (!user.accessibilitySettings.lastActiveClients) {
            user.accessibilitySettings.lastActiveClients = {};
        }

        // Use a string key for the map to ensure stability in Mixed types
        user.accessibilitySettings.lastActiveClients[companyId.toString()] = user.activeClientID;

        // Mark as modified if it's a Nested Mixed type
        user.markModified('accessibilitySettings.lastActiveClients');

        await user.save();
        console.log(`[DEBUG] Context Switched for User: ${user.email}. Target Company: ${user.currentCompanyID}, Client: ${user.activeClientID}`);

        // Populate Role for token payload
        const populatedUser = await User.findById(user._id).populate('roleID');
        const userObj = populatedUser.toObject();
        delete userObj.password;

        // Normalize field names
        userObj.id = userObj._id;
        userObj.clientID = await filterClientsByContext(userObj);
        userObj.clients = userObj.clientID;

        res.json({
            ...userObj,
            token: generateToken(user._id, user.email, user.companyID, user.activeClientID, user.role, user.roleID, user.currentCompanyID, user.accessibilitySettings?.productAdmin),
        });
    } catch (error) {
        console.error('Switch Context Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Login with Google
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        // 1. Verify Token with Google
        const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: { Authorization: `Bearer ${credential}` }
        });

        if (!googleRes.ok) {
            throw new Error('Failed to verify Google token');
        }

        const googleUser = await googleRes.json();
        const email = googleUser.email;

        if (!email) {
            return res.status(400).json({ message: 'Invalid Google Token: Email missing' });
        }

        // 2. Find or Create User
        let user = await User.findOne({ email });

        if (!user) {
            // Check if we allow auto-registration
            // For now, let's create a basic user to unblock login
            const randomPwd = Math.random().toString(36).slice(-8) + "1Aa!";
            const Company = require('../models/Company');
            const defaultCompany = await Company.findOne({}); // Fallback

            if (!defaultCompany) {
                return res.status(400).json({ message: 'No company context found. Cannot auto-register.' });
            }

            user = await User.create({
                email,
                password: randomPwd,
                role: 'User',
                companyID: defaultCompany._id, // Assign to first company
                isGoogleLinked: true
            });
        }

        // 3. Generate JWT (Same as loginUser)
        const populatedUser = await User.findById(user._id).populate('roleID');

        // Update Login Stats
        user.loginCount = (user.loginCount || 0) + 1;
        user.lastLoginAt = new Date();
        user.lastActiveAt = new Date();
        await user.save();

        const userObj = populatedUser.toObject();
        delete userObj.password;

        userObj.id = userObj._id;
        userObj.clientID = await filterClientsByContext(userObj);
        userObj.clients = userObj.clientID;

        res.json({
            ...userObj,
            token: generateToken(user._id, user.id, user.companyID, user.activeClientID, user.role, user.roleID, user.currentCompanyID, user.accessibilitySettings?.productAdmin),
        });

    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ message: 'Google Login Failed' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    impersonateUser,
    listRoles,
    createRole,
    updateRole,
    deleteRole,
    switchCompany,
    googleLogin
};
