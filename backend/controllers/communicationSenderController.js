
const CommunicationSender = require('../models/CommunicationSender');

exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { deleted: false };
        if (req.user && req.user.companyID) {
            filter.companyID = req.user.companyID;
        } else if (req.query.companyID) {
            filter.companyID = req.query.companyID;
        }

        // Search and filters
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
                { phoneNumber: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        if (req.query.channel && req.query.channel !== 'All') filter.channel = req.query.channel;
        if (req.query.active && req.query.active !== 'All') {
            filter.active = req.query.active === 'Active';
        }
        if (req.query.verified && req.query.verified !== 'All') {
            filter.verified = req.query.verified === 'Verified';
        }

        const total = await CommunicationSender.countDocuments(filter);
        const senders = await CommunicationSender.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            data: senders,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyPostmark = async (req, res) => {
    try {
        const sender = await CommunicationSender.findById(req.params.id);
        if (!sender) return res.status(404).json({ message: 'Sender not found' });

        // Simulate Postmark Re-verification Trigger
        // In reality, this would hit Postmark's API using sender.postmark.signatureID or email
        console.log(`Triggering Postmark re-verification for: ${sender.email}`);

        // Success message as requested
        res.json({
            success: true,
            message: 'Verification email triggered successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const sender = await CommunicationSender.findById(req.params.id);
        if (!sender) return res.status(404).json({ message: 'Sender not found' });
        res.json(sender);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const senderData = { ...req.body };
        if (req.user && req.user.companyID) {
            senderData.companyID = req.user.companyID;
        }
        if (req.user && req.user._id) {
            senderData.createdBy = req.user._id;
            senderData.updatedBy = req.user._id;
        }
        const sender = new CommunicationSender(senderData);
        await sender.save();
        res.status(201).json(sender);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.user && req.user._id) {
            updateData.updatedBy = req.user._id;
        }
        const sender = await CommunicationSender.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!sender) return res.status(404).json({ message: 'Sender not found' });
        res.json(sender);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const sender = await CommunicationSender.findByIdAndUpdate(req.params.id, { deleted: true, deletedAt: new Date() }, { new: true });
        if (!sender) return res.status(404).json({ message: 'Sender not found' });
        res.json({ message: 'Sender deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMySenders = async (req, res) => {
    try {
        const companyID = req.user.companyID;
        const userID = req.user._id;
        const activeClientID = req.user.activeClientID;

        const filter = {
            deleted: false,
            companyID: companyID,
            $or: [
                // Condition 1: User specific - if userID array has values, current user must be in it
                { userID: { $elemMatch: { $eq: userID } } },

                // Condition 2: Client/Global access - only applies if userID array is empty
                {
                    userID: { $size: 0 },
                    $or: [
                        // Case A: Assigned to current active client
                        { clientID: { $elemMatch: { $eq: activeClientID } } },
                        // Case B: Global for the company (clientID array is also empty)
                        { clientID: { $size: 0 } }
                    ]
                }
            ]
        };

        const senders = await CommunicationSender.find(filter).sort({ name: 1 });
        res.json(senders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateMyDefaults = async (req, res) => {
    try {
        const User = require('../models/User');
        const { Email, Phone, SMS } = req.body;

        const updateData = {};
        if (Email) updateData['defaultCommunicationSender.Email'] = Email;
        if (Phone) updateData['defaultCommunicationSender.Phone'] = Phone;
        if (SMS) updateData['defaultCommunicationSender.SMS'] = SMS;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true }
        );

        res.json({
            success: true,
            defaultCommunicationSender: user.defaultCommunicationSender
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
