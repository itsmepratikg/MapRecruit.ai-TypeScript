const mongoose = require('mongoose');
const User = require('../models/User');

// @desc    Get all users for the tenant
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ companyID: req.user.companyID }).select('-password');
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
        // Construct query to handle both String and ObjectId types for _id
        let idQuery = [{ _id: req.params.id }];
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            idQuery.push({ _id: new mongoose.Types.ObjectId(req.params.id) });
        }

        const user = await User.findOne({
            $or: idQuery,
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
        const { email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            ...req.body,
            companyID: req.user.companyID // Ensure tenant context
        });

        const createdUser = await User.findById(user._id).select('-password');
        res.status(201).json(createdUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
    try {
        // Construct query to handle both String and ObjectId types for _id
        let idQuery = [{ _id: req.params.id }];
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            idQuery.push({ _id: new mongoose.Types.ObjectId(req.params.id) });
        }

        const user = await User.findOne({
            $or: idQuery,
            companyID: req.user.companyID
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            if (key === 'accessibilitySettings') {
                // Deep merge for accessibilitySettings to allow partial updates
                user.accessibilitySettings = {
                    ...user.accessibilitySettings,
                    ...req.body.accessibilitySettings,
                    dashboardConfig: {
                        ...(user.accessibilitySettings?.dashboardConfig || {}),
                        ...(req.body.accessibilitySettings?.dashboardConfig || {})
                    }
                };
                user.markModified('accessibilitySettings');
            } else if (key !== 'password' && key !== '_id') {
                user[key] = req.body[key];
            }
        });

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

        user.password = 'Domain12!';
        await user.save();
        res.status(200).json({ success: true, message: 'Password reset to Domain12!' });
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
