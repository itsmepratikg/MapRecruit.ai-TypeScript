const mongoose = require('mongoose');
const Client = require('../models/Client');
const User = require('../models/User');

// @desc    Get all clients (Filtered by Company and User Access)
// @route   GET /api/clients
// @access  Private
const getClients = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const companyID = req.user.currentCompanyID || req.user.companyID;

        if (!companyID) {
            return res.status(400).json({ message: 'User has no Company ID' });
        }

        if (!mongoose.Types.ObjectId.isValid(companyID)) {
            return res.status(400).json({ message: 'Invalid Company ID format' });
        }

        // 1. Fetch User to determine Access Level
        const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isAdmin = ['Product Admin', 'Admin', 'Super Admin'].includes(user.role);

        // 2. Build Query
        let query = { companyID: new mongoose.Types.ObjectId(companyID) };

        if (!isAdmin) {
            const userClientIds = (user.clients || []).map(id =>
                mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id
            );
            query._id = { $in: userClientIds };
        }

        // 3. Fetch Clients
        const clients = await Client.find(query);

        // 4. Format Output
        const formattedClients = clients.map(c => {
            const doc = c.toObject ? c.toObject() : c;
            return {
                ...doc,
                _id: doc._id,
                clientName: doc.clientName || doc.name || 'Unnamed Client',
                clientCode: doc.clientCode || '',
                clientType: doc.clientType || 'Client',
                status: doc.status || (doc.enable === false ? 'Inactive' : 'Active')
            };
        });

        res.status(200).json(formattedClients);

    } catch (error) {
        console.error('[DEBUG] getClients - FATAL ERROR:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createClient = async (req, res) => {
    try {
        const { clientName, companyID, ...otherFields } = req.body;

        if (!companyID || !mongoose.Types.ObjectId.isValid(companyID)) {
            return res.status(400).json({ message: 'Valid Company ID is required' });
        }

        // 1. Fetch Company to inherit theme settings
        const Company = require('../models/Company');
        const company = await Company.findById(companyID);

        const themesdata = company?.themesdata || {
            themeVariables: { mainColor: '#0d6efd' }
        };

        // 2. Create the client with inherited theme
        const client = await Client.create({
            clientName,
            companyID,
            themesdata, // Inheritance from Company
            ...otherFields,
            updatedBy: req.user.id
        });

        // 3. Update Company document to include new client
        if (company) {
            if (!company.clients) company.clients = [];
            company.clients.push(client._id);
            await company.save();
        }

        res.status(201).json(client);
    } catch (error) {
        console.error('[DEBUG] createClient - FATAL ERROR:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getClientById = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const clientId = req.params.id ? req.params.id.trim() : null;

        console.log(`[DEBUG] getClientById - UserID: ${userId}, ClientID: ${clientId}`);

        if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) {
            return res.status(400).json({ message: 'Invalid Client ID format' });
        }

        // 1. Fetch User to determine Access Level
        const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });
        if (!user) {
            console.warn(`[DEBUG] getClientById - User not found for ID: ${userId}`);
            return res.status(404).json({ message: 'User not found' });
        }

        const isAdmin = ['Product Admin', 'Admin', 'Super Admin'].includes(user.role);
        console.log(`[DEBUG] getClientById - User Role: ${user.role}, IsAdmin: ${isAdmin}`);

        // 3. Fetch Client
        const client = await Client.findOne({ _id: new mongoose.Types.ObjectId(clientId) });

        if (!client) {
            console.warn(`[DEBUG] getClientById - Client not found in database for ID: ${clientId}`);
            return res.status(404).json({ message: 'Client not found in database' });
        }

        // 4. Verify Access
        const userCompanyID = req.user.currentCompanyID || req.user.companyID || user.currentCompanyID || user.companyID;
        console.log(`[DEBUG] getClientById - Context CompanyID: ${userCompanyID}, Client's CompanyID: ${client.companyID}`);

        // If not Product Admin, enforce company match
        if (user.role !== 'Product Admin') {
            if (client.companyID && userCompanyID && client.companyID.toString() !== userCompanyID.toString()) {
                console.warn(`[DEBUG] getClientById - Access Denied (Company Mismatch). Client CoID: ${client.companyID}, User CoID: ${userCompanyID}`);
                return res.status(403).json({ message: 'Access denied to this client' });
            }

            // If not admin, check if user is assigned to this client
            if (!isAdmin) {
                const userClientIds = (user.clients || []).map(id => id.toString());
                if (!userClientIds.includes(clientId.toString())) {
                    console.warn(`[DEBUG] getClientById - Access Denied (User not assigned). ClientID: ${clientId}`);
                    return res.status(403).json({ message: 'Access denied. You are not assigned to this client.' });
                }
            }
        }

        console.log(`[DEBUG] getClientById - Access Granted for ${client.clientName}`);

        const doc = client.toObject();
        const formattedClient = {
            ...doc,
            _id: doc._id,
            clientName: doc.clientName || doc.name || 'Unnamed Client',
            clientCode: doc.clientCode || '',
            clientType: doc.clientType || 'Client',
            status: doc.status || (doc.enable === false ? 'Inactive' : 'Active')
        };

        res.status(200).json(formattedClient);

    } catch (error) {
        console.error('[DEBUG] getClientById - FATAL ERROR:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateClient = async (req, res) => {
    try {
        const clientId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            return res.status(400).json({ message: 'Invalid Client ID format' });
        }

        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Verify company ownership
        const userCompanyID = req.user.currentCompanyID || req.user.companyID;
        if (client.companyID.toString() !== userCompanyID.toString()) {
            return res.status(403).json({ message: 'Access denied to this client' });
        }

        // Update fields using findByIdAndUpdate with $set to handle nested paths like 'themesdata.themeVariables.mainColor'
        const updatedClient = await Client.findByIdAndUpdate(
            clientId,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.json(updatedClient);
    } catch (error) {
        console.error('[DEBUG] updateClient - FATAL ERROR:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getClients,
    getClientById,
    updateClient,
    createClient
};
