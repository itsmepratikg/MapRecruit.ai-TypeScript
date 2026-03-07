const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env from current directory
dotenv.config();

const Client = require('./models/Client');
const User = require('./models/User');

async function checkAccess() {
    try {
        console.log('Connecting to', process.env.MONGO_URI || 'mongodb://localhost:27017/MRv5');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/MRv5');
        console.log('Connected to DB');

        const userId = '614d569f77f21325cdbd314a'; // Pratik
        const clientId = '6901bde590298a71b8360d61'; // Target Client

        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found');
            return;
        }
        console.log('User role:', user.role);
        console.log('User companyID:', user.companyID);

        const client = await Client.findById(clientId);
        if (!client) {
            console.log('Client not found via Mongoose model');
            const raw = await mongoose.connection.collection('clientsdb').findOne({ _id: new mongoose.Types.ObjectId(clientId) });
            if (raw) {
                console.log('Client FOUND via RAW query!');
            }
            return;
        }

        console.log('Client found via Mongoose model');
        console.log('Client Name:', client.clientName);
        console.log('Client CoID:', client.companyID);

        const match = client.companyID.toString() === user.companyID.toString();
        console.log('Company Match:', match);

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkAccess();
